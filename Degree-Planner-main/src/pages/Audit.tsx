import styled from '@emotion/styled'
import { useAppSelector } from '../app/hooks'
import {
    getGPA,
    requiredGrades,
    PredictedGrades,
} from '../features/degreePlan/gpa'
import { TranscriptData } from '../features/student/model/transcriptData'
import { Class } from '../features/student/model/'
import { RequiredCourse } from '../features/trackRequirements/model'
import { Box, Button } from '@mui/material'
import { ArrowBack, Print } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Fragment } from 'react'

export default function Audit() {
    const navigate = useNavigate()

    const Container = styled.div`
        display: flex;
        flex-direction: column;
        background-color: white;
        color: black;
        flex-grow: 1;
        align-items: center;
    `
    const Header = styled.h3`
        align-self: center;
    `

    const [degreePlan, student] = useAppSelector((state) => [
        state.degreePlan,
        state.student,
    ])
    const studentObjectTemp = student.transcript
    const studentObject = JSON.parse(
        JSON.stringify(studentObjectTemp!)
    ) as TranscriptData
    let coreClasses: { [key: string]: Class } = {}
    let electiveClasses: { [key: string]: Class } = {}

    //override classes
    for (const [key] of Object.entries(degreePlan.classOverrides)) {
        studentObject!.classes[key] = degreePlan.classOverrides[key]
    }

    //find the elective classes
    degreePlan.requirements.electives.groups![0].classes.forEach(
        ({ prefix, number, name }) => {
            if (studentObject?.classes[`${prefix} ${number}`] !== undefined) {
                electiveClasses[`${prefix} ${number}`] =
                    studentObject?.classes[`${prefix} ${number}`]
            } else {
                electiveClasses[`${prefix} ${number}`] = {
                    prefix: prefix,
                    course: number,
                    name: name,
                    grade: {},
                    otherGrades: [],
                    transfer: false,
                    fastTrack: false,
                }
            }
        }
    )
    degreePlan.requirements.electives.groups![1].classes.forEach(
        ({ prefix, number, name }) => {
            if (studentObject?.classes[`${prefix} ${number}`] !== undefined) {
                electiveClasses[`${prefix} ${number}`] =
                    studentObject?.classes[`${prefix} ${number}`]
            } else {
                electiveClasses[`${prefix} ${number}`] = {
                    prefix: prefix,
                    course: number,
                    name: name,
                    grade: {},
                    otherGrades: [],
                    transfer: false,
                    fastTrack: false,
                }
            }
        }
    )
    //Find all core classes

    degreePlan.requirements.core.classes!.forEach(
        ({ prefix, number, name }) => {
            if (studentObject?.classes[`${prefix} ${number}`] !== undefined) {
                coreClasses[`${prefix} ${number}`] =
                    studentObject?.classes[`${prefix} ${number}`]
            } else {
                coreClasses[`${prefix} ${number}`] = {
                    prefix: prefix,
                    course: number,
                    name: name,
                    grade: {},
                    otherGrades: [],
                    transfer: false,
                    fastTrack: false,
                }
            }
        }
    )

    //find the elective core in the requirments
    let nonElectivecourses: RequiredCourse[] = []
    if (degreePlan.requirements.core.groups !== undefined) {
        degreePlan.requirements.core.groups![0].classes.forEach(
            ({ prefix, number, name }) => {
                if (electiveClasses[`${prefix} ${number}`] === undefined) {
                    nonElectivecourses.push({
                        prefix: prefix,
                        number: number,
                        name: name,
                    })
                }
            }
        )
    }
    // core electives not in electives, check to see if they have a grade and or date
    let gradedcourses: RequiredCourse[] = []
    let nongradedcourses: RequiredCourse[] = []
    nonElectivecourses.forEach(({ prefix, number, name }) => {
        if (
            studentObject?.classes[`${prefix} ${number}`]?.grade.grade !==
            undefined
        ) {
            gradedcourses.push({
                prefix: prefix,
                number: number,
                name: name,
            })
        } else {
            nongradedcourses.push({
                prefix: prefix,
                number: number,
                name: name,
            })
        }
    })

    //see if the graded courses meet the requirement if not add the ones with semesters and if not choose random

    if (degreePlan.requirements.core.groups !== undefined) {
        if (
            gradedcourses.length ===
            degreePlan.requirements.core.groups![0].countRequired!
        ) {
            gradedcourses.forEach(({ prefix, number, name }) => {
                coreClasses[`${prefix} ${number}`] =
                    studentObject!.classes[`${prefix} ${number}`]
            })
        } else if (
            gradedcourses.length <
            degreePlan.requirements.core.groups![0].countRequired!
        ) {
            gradedcourses.forEach(({ prefix, number, name }) => {
                coreClasses[`${prefix} ${number}`] =
                    studentObject!.classes[`${prefix} ${number}`]
            })
            nongradedcourses.forEach(({ prefix, number, name }) => {
                coreClasses[`${prefix} ${number}`] =
                    studentObject!.classes[`${prefix} ${number}`]
            })
        }
    }
    //list out the core and elective courses

    const coreGPAtranscript = { ...studentObject, classes: coreClasses }
    const electiveGPAtranscript = {
        ...studentObject,
        classes: electiveClasses,
    }

    const coreString = Object.keys(coreClasses).join(', ')
    const electiveString = Object.keys(electiveClasses).join(', ')

    //make outstanding requirements
    const corePrediction = requiredGrades(
        coreGPAtranscript as TranscriptData,
        degreePlan.requirements.core.gpaRequired
    )
    const electivePrediction = requiredGrades(
        electiveGPAtranscript as TranscriptData,
        degreePlan.requirements.electives.gpaRequired
    )
    const overallPrediction = requiredGrades(
        studentObject as TranscriptData,
        3.0
    )

    // print out pre reqs to string actually write code to check after presentation
    const preReqString = degreePlan.requirements.prerequisites
        .classes!.concat(degreePlan.requirements.other.classes!)
        .map(({ prefix, number }) => {
            return `${prefix} ${number} ${
                studentObject.classes[`${prefix} ${number}`]?.grade.grade !==
                undefined
                    ? `: Completed ${
                          studentObject.classes[`${prefix} ${number}`].grade
                              .semester?.semester
                      } ${
                          studentObject.classes[`${prefix} ${number}`].grade
                              .semester?.year
                      } : ${
                          studentObject.classes[`${prefix} ${number}`].grade
                              .grade
                      }`
                    : `: Not Completed`
            }`
        })

    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Header>Audit Report</Header>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <b>Name:</b> {studentObject?.name}
                        <br />
                        <b>Plan:</b> Master
                        <br />
                    </Box>
                    <Box>
                        <b>ID:</b> {studentObject?.id}
                        <br />
                        <b>Major:</b> {degreePlan.major}
                        <br />
                        <b>Track:</b> {degreePlan.track}
                    </Box>
                </Box>
                <Box sx={{ marginTop: '1.5em' }}>
                    <b>Core GPA:</b>{' '}
                    {getGPA(coreGPAtranscript as TranscriptData)} <br />
                    <b>Elective GPA:</b>{' '}
                    {getGPA(electiveGPAtranscript as TranscriptData)}
                    <br />
                    <b>Combined GPA:</b>{' '}
                    {getGPA(studentObject as TranscriptData)}
                </Box>
                <Box sx={{ marginTop: '1.5em' }}>
                    <b>Core Courses:</b> {coreString} <br />
                    <b>Elective Courses:</b> {electiveString}
                </Box>
                <Box>
                    <b>
                        Leveling Courses and Pre-requisites from Admission
                        Letter:
                    </b>{' '}
                    {preReqString.length > 0
                        ? preReqString.map((s, i) => (
                              <Fragment key={i}>
                                  <br />
                                  {s}
                              </Fragment>
                          ))
                        : 'None'}
                </Box>
                <Box>
                    <h4>Outstanding Requiremtents:</h4>
                    <b>Core:</b>{' '}
                    {requirments(
                        corePrediction,
                        degreePlan.requirements.core.gpaRequired!
                    )}
                    <br />
                    <b>Elective:</b>{' '}
                    {requirments(
                        electivePrediction,
                        degreePlan.requirements.electives.gpaRequired!
                    )}
                    <br />
                    <b>Overall:</b> {requirments(overallPrediction, 3.0)}
                </Box>
                <Box
                    className="noprint"
                    sx={{
                        marginTop: '10px',
                        marginBottom: '10px',
                        display: 'flex',
                        alignSelf: 'stretch',
                        justifyContent: 'space-around',
                        gap: '10px',
                    }}
                >
                    <Button
                        variant="contained"
                        title="Back"
                        onClick={() => navigate('/degreePlan')}
                    >
                        <ArrowBack /> Back
                    </Button>
                    <Button
                        variant="contained"
                        title="Print"
                        onClick={window.print}
                    >
                        <Print /> Print
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}

function requirments(prediction: PredictedGrades, requiredGPA: number) {
    if (prediction.classes.length === 0) {
        return 'Complete '
    } else if (prediction.avgGrade! < 2) {
        let classList = ''
        prediction.classes.forEach(({ prefix, course }) => {
            classList = classList.concat(`${prefix} ${course} `)
        })
        return `To maintain ${requiredGPA} GPA\n   Student Must Pass ${classList} `
    } else if (prediction.avgGrade! < 4) {
        let classList = ''
        prediction.classes.forEach(({ prefix, course }) => {
            classList = classList.concat(`${prefix} ${course} `)
        })
        return `To maintain ${requiredGPA} GPA\n   The Student needs a GPA >= ${prediction.avgGrade?.toFixed(
            2
        )} in: ${classList} `
    } else {
        let classList = ''
        prediction.classes.forEach(({ prefix, course }) => {
            classList = classList.concat(`${prefix} ${course} `)
        })
        return `GPA is not Possible in ${classList}`
    }
}
