import { createAsyncThunk } from '@reduxjs/toolkit'
import { Semester, SemesterYear, TranscriptDataResponse } from './model'
import { TextItem as PdfTextItem } from 'pdfjs-dist/types/src/display/api'
import { RootState } from '../../app/store'
import { Class } from './model'
import { Grade } from './model/grade'

const importTranscript = createAsyncThunk(
    'student/importTranscript',
    async (file: Blob, { getState }): Promise<TranscriptDataResponse> => {
        // We import this here so that it's only loaded during client-side rendering.
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js'
        const pdf = await pdfjs.getDocument(await file.arrayBuffer()).promise
        let pages: string[][][] = []
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textElements = await page.getTextContent({
                disableCombineTextItems: false,
                includeMarkedContent: false,
            })
            const textItems = textElements.items as Array<PdfTextItem>

            // Group into rows
            const pageRows = textItems
                .filter((element) => element.str.trim() !== '')
                .reduce((tmpRows, element) => {
                    const group =
                        tmpRows[Math.floor(element.transform[5])] ?? []
                    group.push(element)
                    tmpRows[Math.floor(element.transform[5])] = group
                    return tmpRows
                }, {} as { [x: number]: PdfTextItem[] })

            // Get the row posses sorted in reverse(y=0 is at the bottom)
            const rowPoses = Object.keys(pageRows)
                .map(Number)
                .sort((a, b) => b - a)
            pages.push(
                rowPoses.map((pos) =>
                    pageRows[pos]
                        .sort((a, b) => a.transform[4] - b.transform[4])
                        .map((element) => element.str)
                )
            )
        }

        // Load info from first page
        const nameRowI = pages[0].findIndex((row) => row[0] === 'Name:')
        if (nameRowI < 0) {
            throw new Error('Failed to find name')
        }

        const idRowI = pages[0].findIndex(
            (row) =>
                row[0] === 'Student ID:' ||
                (row[0] === 'Student' && row[1] === 'ID:')
        )
        if (idRowI < 0) {
            throw new Error('Failed to find the student id')
        }
        const id =
            pages[0][idRowI][1] === 'ID:'
                ? pages[0][idRowI][2]
                : pages[0][idRowI][1]

        // Concat pages together
        const concatedPages = pages
            .reduce((res, page) => res.concat(page.slice(0, -1)), [])
            .filter((v) => v[0] !== pages[0][0][0] && v[0] !== pages[0][1][0])

        // Find Masters Major
        const majorRowI =
            concatedPages.findLastIndex(
                (row) => row[0] === 'Program:' && row[1] === 'Master'
            ) + 2
        if (
            majorRowI < 2 ||
            !concatedPages[majorRowI][
                concatedPages[majorRowI].length - 1
            ].includes(' Major')
        ) {
            throw new Error('Failed to find the Major name')
        }
        let major =
            concatedPages[majorRowI][concatedPages[majorRowI].length - 1]
        major = major.slice(0, major.indexOf(' Major'))

        // Continue down for semester addmitted
        const splitAddmitted = concatedPages[majorRowI + 3][0].split(' ')
        if (
            isNaN(+splitAddmitted[0]) ||
            !Object.values(Semester).includes(splitAddmitted[1] as Semester)
        ) {
            throw new Error('Failed to find the Semester Addmitted')
        }
        const semesterAdmitted = {
            semester: splitAddmitted[1] as Semester,
            year: +splitAddmitted[0],
        }

        // Load classes
        let courseGroupSemester: SemesterYear | undefined = undefined
        let transfer = false
        let fastTrack = false
        const classRows = concatedPages
            .map((row, i) => {
                // Handle start and stop of course groups
                if (row[0].startsWith('Transfer Credit from')) {
                    if (row[0].endsWith('Fast Track')) {
                        fastTrack = true
                    } else {
                        transfer = true
                    }
                }
                if (row[0] === 'Course') {
                    if (courseGroupSemester != null) {
                        return null!
                    }

                    const splitSemeterYear = concatedPages[i - 1][0].split(' ')
                    if (
                        isNaN(+splitSemeterYear[0]) ||
                        !Object.values(Semester).includes(
                            splitSemeterYear[1] as Semester
                        )
                    ) {
                        throw new Error(
                            'Failed to find the Semester for course group'
                        )
                    }
                    courseGroupSemester = {
                        semester: splitSemeterYear[1] as Semester,
                        year: +splitSemeterYear[0],
                    }
                    return null!
                }
                if (row[0].includes('GPA')) {
                    courseGroupSemester = undefined
                    transfer = false
                    fastTrack = false
                    return null!
                }

                // Skip middle rows
                if (row.length < 6) {
                    return null!
                }

                if (courseGroupSemester) {
                    return {
                        semester: courseGroupSemester,
                        row,
                        transfer,
                        fastTrack,
                    }
                }

                return null!
            })
            .filter((tuple) => tuple)

        const classes: { [key: string]: Class } = {}
        classRows.forEach(({ semester, row, transfer, fastTrack }) => {
            if (isNaN(+row[1])) {
                throw new Error(`Invalid class entry: ${row}`)
            }
            const key = `${row[0]} ${row[1]}`
            let otherGrades: Grade[] = []
            if (classes[key]) {
                if (
                    (fastTrack || transfer) &&
                    classes[key].grade.grade === row[5]
                ) {
                    classes[key].transfer = transfer
                    classes[key].fastTrack = fastTrack
                    return
                }
                otherGrades = [classes[key].grade, ...classes[key].otherGrades]
            }

            classes[key] = {
                prefix: row[0],
                course: +row[1],
                name: row[2]
                    .toLowerCase()
                    .split(' ')
                    .map((s) =>
                        s === 'ii' ||
                        s === 'cs' ||
                        s === 'ce' ||
                        s === 'se' ||
                        s === 'cs/se'
                            ? s.toUpperCase()
                            : s.charAt(0).toUpperCase() + s.substring(1)
                    )
                    .join(' '), // Fix capitlization
                grade: {
                    semester,
                    grade: +row[5] === 0 ? undefined : row[5],
                },
                otherGrades,
                transfer,
                fastTrack,
            }
        })

        let transcript = {
            name: pages[0][nameRowI][1],
            id,
            major,
            semesterAdmitted,
            classes,
        }

        let requirements = (getState() as RootState).trackRequirements
        let requirementsOptions = Object.keys(requirements)
            .map((key) => requirements[key])
            .filter((r) => r.major === transcript.major)

        return {
            transcript,
            track:
                requirementsOptions.length === 1
                    ? requirementsOptions[0].name
                    : '',
        }
    }
)
export default importTranscript
