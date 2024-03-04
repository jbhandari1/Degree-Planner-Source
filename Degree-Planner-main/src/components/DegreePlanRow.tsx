import {
    Autocomplete,
    Box,
    Button,
    ButtonGroup,
    TextField,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { Class } from '../features/student/model'
import { RequiredCourse } from '../features/trackRequirements/model'
import { DegreePlanRequiredCourse } from '../features/degreePlan/model'
import { Delete, RestartAlt } from '@mui/icons-material'
import GradeSelector from './GradeSelector'

interface DegreePlanRowProps {
    course?: DegreePlanRequiredCourse
    transcriptClass?: Class
    overrideClass?: Class
    suggestedClasses?: RequiredCourse[]
    allClassesSortedNumber?: Class[]
    allClassesSortedName?: Class[]
    onOverrideChange?: (value?: Class) => void
    onCourseChange?: (value: RequiredCourse) => void
    onRemove?: () => void
}

export default function DegreePlanRow(props: DegreePlanRowProps) {
    const [courseName, setCourseName] = useState(
        props.course?.name === '' ? undefined : props.course?.name
    )
    const [courseNumber, setCourseNumber] = useState(
        props.course
            ? `${props.course?.prefix} ${props.course?.number}`
            : undefined
    )

    const [courseNumberErrorMessage, setCourseNumberErrorMessage] = useState<
        string | undefined
    >(undefined)

    const getErrorMessage = (
        newCourseNumber?: string,
        curCourseName?: string
    ) => {
        if (!newCourseNumber) {
            if (curCourseName && curCourseName !== '') {
                return 'Must have a course number'
            }
            return
        }

        const split = newCourseNumber.split(' ')

        if (split.length !== 2) {
            return 'Must have prefix and number'
        }

        if (isNaN(+split[1])) {
            return 'Second part must be be a number'
        }
    }

    const getErrorMessageCallback = useCallback(getErrorMessage, [])

    useEffect(() => {
        const tmpNumber = props.course
            ? `${props.course?.prefix} ${props.course?.number}`
            : undefined
        const tmpName =
            props.course?.name === '' ? undefined : props.course?.name
        setCourseName(tmpName)
        setCourseNumber(tmpNumber)
        setCourseNumberErrorMessage(getErrorMessageCallback(tmpNumber, tmpName))
    }, [props.course, getErrorMessageCallback])

    const pushOverrideChange = (value?: Class) => {
        if (props.onOverrideChange) {
            if (
                props.transcriptClass?.grade.grade === value?.grade.grade &&
                props.transcriptClass?.grade.semester?.semester ===
                    value?.grade.semester?.semester &&
                props.transcriptClass?.grade.semester?.year ===
                    value?.grade.semester?.year &&
                (props.transcriptClass?.transfer ?? false) ===
                    (value?.transfer ?? false) &&
                (props.transcriptClass?.fastTrack ?? false) ===
                    (value?.fastTrack ?? false) &&
                (props.transcriptClass?.otherGrades.length ?? 0) ===
                    (value?.otherGrades.length ?? 0) &&
                value?.otherGrades.every(
                    (g, i) =>
                        props.transcriptClass?.otherGrades[i].grade ===
                            g.grade &&
                        props.transcriptClass?.otherGrades[i].semester ===
                            g.grade
                )
            ) {
                props.onOverrideChange(undefined)
                return
            }
            props.onOverrideChange(value)
        }
    }

    const transferOptions = ['Transfer', 'Fast Track'].map((v) => ({
        label: v,
    }))

    const edited = props.overrideClass

    let courseNumbers =
        props.allClassesSortedNumber?.map((c) => `${c.prefix} ${c.course}`) ??
        []

    if (props.suggestedClasses && props.suggestedClasses.length > 0) {
        courseNumbers = props.suggestedClasses
            .map((c) => `${c.prefix} ${c.number}`)
            .concat(courseNumbers)
            .filter((n, i, self) => self.indexOf(n) === i) // limit to Unique
    }

    if (courseNumber && courseNumbers.indexOf(courseNumber) < 0) {
        courseNumbers = [...courseNumbers, courseNumber]
    }
    const courseNumberOptions = courseNumbers.map((n) => ({
        label: n,
    }))

    let courseNames = props.allClassesSortedName?.map((c) => c.name) ?? []

    if (props.suggestedClasses && props.suggestedClasses.length > 0) {
        courseNames = props.suggestedClasses
            .map((c) => c.name)
            .concat(courseNames)
            .filter((n, i, self) => self.indexOf(n) === i) // limit to Unique
    }

    if (courseName && courseNames.indexOf(courseName) < 0) {
        courseNames = [...courseNames, courseName]
    }
    const courseNameOptions = courseNames.map((n) => ({
        label: n,
    }))

    const onCourseNumberChange = (value: null | string | { label: string }) => {
        const newCourseNumber =
            typeof value !== 'string'
                ? value?.label
                : value !== ''
                ? value.toUpperCase()
                : undefined

        if (value === courseNumber) {
            return
        }

        if (!newCourseNumber && props.course) {
            const tmp = courseNumber
            setCourseNumber('')

            setTimeout(() => setCourseNumber(tmp), 100)
            return
        }

        let newCourseName = props.suggestedClasses?.find(
            (c) => `${c.prefix} ${c.number}` === newCourseNumber
        )?.name

        if (!newCourseName) {
            newCourseName = props.allClassesSortedName?.find(
                (c) => `${c.prefix} ${c.course}` === newCourseNumber
            )?.name
            if (!newCourseName && courseNumber === newCourseNumber) {
                newCourseName = courseName
            }
        }

        const errorMessage = getErrorMessage(newCourseNumber, newCourseName)
        setCourseNumber(newCourseNumber)
        console.log(newCourseName)
        setCourseName(newCourseName)
        setCourseNumberErrorMessage(errorMessage)

        const split = newCourseNumber?.split(' ')
        if (props.onCourseChange && split && !errorMessage) {
            props.onCourseChange({
                prefix: split[0],
                number: +split[1],
                name: newCourseName ?? '',
            })
        }
    }

    const onCourseNameChange = (value: null | string | { label: string }) => {
        const newCourseName =
            typeof value !== 'string'
                ? value?.label
                : value !== ''
                ? value
                : undefined
        if (value === courseName) {
            return
        }

        if (!newCourseName && courseNumber) {
            const tmp = courseName
            setCourseName('')

            setTimeout(() => setCourseName(tmp), 100)
            return
        }

        let newCourse = props.suggestedClasses?.find(
            (c) => c.name === newCourseName
        )

        if (!newCourse) {
            const course = props.allClassesSortedName?.find(
                (c) => c.name === newCourseName
            )
            if (course) {
                newCourse = {
                    prefix: course.prefix,
                    number: course.course,
                    name: course.name,
                }
            }
        }

        const errorMessage = getErrorMessage(
            newCourse ? `${newCourse?.prefix} ${newCourse?.number}` : undefined,
            newCourseName
        )
        const newCourseNumber = newCourse
            ? `${newCourse?.prefix} ${newCourse?.number}`
            : ''
        setCourseNumberErrorMessage(errorMessage)
        setCourseNumber(newCourseNumber)
        setCourseName(newCourseName ?? '')

        if (!newCourse && !props.course) {
            return
        }

        if (props.onCourseChange) {
            props.onCourseChange({
                prefix: (newCourse?.prefix ?? props.course?.prefix)!, // We check above
                number: (newCourse?.number ?? props.course?.number)!,
                name: newCourseName ?? '',
            })
        }
    }

    const classEntry = props.overrideClass
        ? props.overrideClass
        : props.transcriptClass

    return (
        <Box sx={{ display: 'flex', gap: '10px' }}>
            <Autocomplete
                options={courseNumberOptions}
                title="Course Number"
                sx={{ width: 150 }}
                disableClearable
                freeSolo
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Course Number"
                        error={courseNumberErrorMessage !== undefined}
                        helperText={courseNumberErrorMessage}
                        onBlur={(event) =>
                            onCourseNumberChange(event.target.value)
                        }
                    />
                )}
                value={
                    props.course
                        ? courseNumberOptions.find(
                              (c) => c.label === courseNumber
                          ) ?? ''
                        : ''
                }
                onChange={(_, value) => onCourseNumberChange(value)}
            />

            <Autocomplete
                options={courseNameOptions}
                disabled={courseNumberErrorMessage !== undefined}
                sx={{ width: 380 }}
                disableClearable
                title="Course Name"
                freeSolo
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Course Name"
                        onBlur={(event) =>
                            onCourseNameChange(event.target.value)
                        }
                    />
                )}
                value={
                    props.course
                        ? courseNameOptions.find(
                              (c) => c.label === courseName
                          ) ?? ''
                        : ''
                }
                onChange={(_, value) => onCourseNameChange(value)}
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <GradeSelector
                    disabled={!props.course}
                    grade={classEntry?.grade}
                    onChange={(value) => {
                        if (!props.onOverrideChange || !props.course) {
                            return
                        }
                        pushOverrideChange({
                            prefix: props.course.prefix,
                            course: props.course.number,
                            name: props.course.name,
                            otherGrades: [],
                            transfer: false,
                            fastTrack: false,
                            ...classEntry,
                            grade: value,
                        })
                    }}
                    addDisabled={
                        !classEntry?.grade.semester?.semester ||
                        !classEntry?.grade.semester?.year ||
                        !classEntry?.grade.grade ||
                        classEntry?.otherGrades.findIndex(
                            (g) =>
                                !g.semester?.semester ||
                                !g.semester?.year ||
                                !g.grade
                        ) > -1
                    }
                    onAdd={() => {
                        if (!props.onOverrideChange || !props.course) {
                            return
                        }

                        pushOverrideChange({
                            prefix: props.course.prefix,
                            course: props.course.number,
                            name: props.course.name,
                            grade: {},
                            transfer: false,
                            fastTrack: false,
                            ...classEntry,
                            otherGrades: [
                                ...(classEntry?.otherGrades ?? []),
                                {},
                            ],
                        })
                    }}
                />

                {classEntry?.otherGrades.map((g, i) => (
                    <GradeSelector
                        key={i}
                        disabled={!props.course}
                        grade={g}
                        onChange={(value) => {
                            if (!props.onOverrideChange || !props.course) {
                                return
                            }
                            pushOverrideChange({
                                ...classEntry,
                                otherGrades:
                                    classEntry?.otherGrades.map((v, j) =>
                                        j !== i ? v : value
                                    ) ?? [],
                            })
                        }}
                        onRemove={() => {
                            if (!props.onOverrideChange || !props.course) {
                                return
                            }
                            pushOverrideChange({
                                ...classEntry,
                                otherGrades:
                                    classEntry?.otherGrades.filter(
                                        (_, j) => j !== i
                                    ) ?? [],
                            })
                        }}
                    />
                ))}
            </Box>

            <Autocomplete
                disabled={!props.course}
                options={transferOptions}
                sx={{ width: 160 }}
                title="Taken as"
                renderInput={(params) => (
                    <TextField {...params} label="Taken As" />
                )}
                value={
                    classEntry?.fastTrack
                        ? transferOptions[1]
                        : classEntry?.transfer
                        ? transferOptions[0]
                        : null
                }
                onChange={(_, value) => {
                    if (!props.onOverrideChange || !props.course) {
                        return
                    }
                    pushOverrideChange({
                        prefix: props.course.prefix,
                        course: props.course.number,
                        name: props.course.name,
                        otherGrades: [],
                        grade: {},
                        ...classEntry,
                        transfer: value ? true : false,
                        fastTrack: value === transferOptions[1],
                    })
                }}
            />

            <ButtonGroup variant="contained">
                {props.course ? (
                    <Button title="Delete Requirement" onClick={props.onRemove}>
                        <Delete />
                    </Button>
                ) : null}
                {edited ? (
                    <Button
                        title="Reset Grade"
                        onClick={(e) =>
                            props.onOverrideChange
                                ? props.onOverrideChange(undefined)
                                : null
                        }
                    >
                        <RestartAlt />
                    </Button>
                ) : null}
            </ButtonGroup>
        </Box>
    )
}
