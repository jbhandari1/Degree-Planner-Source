import styled from '@emotion/styled'
import { useAppSelector } from '../app/hooks'
import { Fragment } from 'react'
import { RequiredCourse } from '../features/trackRequirements/model'
import {
    ArrowBack,
    CheckBoxOutlineBlankOutlined,
    CheckBoxOutlined,
    Print as PrintIcon,
} from '@mui/icons-material'
import { Semester } from '../features/student/model'
import { Box, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Print() {
    const [degreePlan, student] = useAppSelector((state) => [
        state.degreePlan,
        state.student,
    ])
    const navigate = useNavigate()

    const Container = styled.div`
        display: flex;
        flex-direction: column;
        background-color: white;
        color: black;
        flex-grow: 1;
        align-items: center;
    `

    const Table = styled.table`
        background-color: white;
        border: 1.5px solid black;
        border-collapse: collapse;
        line-height: 1.2;
        font-size: 14px;
    `

    const Tr = styled.tr`
        border: 1.5px solid black;
        height: 1.2em;
    `
    const Th = styled.th`
        padding: 0 0.5em 0 0.5em;
        border: 1.5px solid black;
    `

    const NameTh = styled.th`
        padding: 0 0.5em 0 0.5em;
        border: 1.5px solid black;
        text-align: left;
    `

    const HeaderCol = styled.th`
        padding: 0.5em;
        border: 1.5px solid black;
    `

    const CourseGroupHeader = styled.div`
        display: flex;
        justify-content: space-between;
    `

    const Header = styled.p`
        margin: 0px;
    `
    const HeaderContainer = styled.div`
        display: flex;
        justify-content: space-between;
    `

    const LeftBox = styled.div`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-end;
    `

    const RightBox = styled.div`
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-end;
    `

    const semesterMap = {
        [Semester.Fall]: 'F',
        [Semester.Spring]: 'S',
        [Semester.Summer]: 'U',
        [Semester.None]: '',
    }

    const formatClass = (c: RequiredCourse | undefined | null, i: number) => {
        const classKey = `${c?.prefix ?? ''} ${c?.number ?? ''}`
        const transcriptCourse =
            degreePlan.classOverrides[classKey] ??
            student.transcript?.classes[classKey]
        return (
            <Tr key={i}>
                <NameTh>{c?.name}</NameTh>
                <Th>{classKey}</Th>
                <Th>
                    {!(transcriptCourse?.otherGrades.length ?? 0)
                        ? `${transcriptCourse?.grade.semester?.year ?? ''} ${
                              transcriptCourse?.grade.semester?.semester ?? ''
                          }`
                        : [
                              transcriptCourse?.grade,
                              ...(transcriptCourse?.otherGrades ?? []),
                          ]
                              .filter((g) => g)
                              .map(
                                  (g) =>
                                      `${
                                          g.semester?.year
                                              ?.toString()
                                              .slice(-2) ?? ''
                                      }${
                                          semesterMap[
                                              g.semester?.semester ??
                                                  Semester.None
                                          ]
                                      }`
                              )
                              .filter((v) => v !== '')
                              .join('/')}
                </Th>
                <Th>
                    {transcriptCourse?.fastTrack
                        ? 'Fast Track'
                        : transcriptCourse?.transfer
                        ? 'Transfer'
                        : null}
                </Th>

                <Th>
                    {[
                        transcriptCourse?.grade,
                        ...(transcriptCourse?.otherGrades ?? []),
                    ]
                        .filter((g) => g)
                        .map((g) => g.grade)
                        .filter((g) => g !== undefined)
                        .join('/')}
                </Th>
            </Tr>
        )
    }
    const groups = Object.keys(degreePlan.requirements).map((key, i) => {
        const requirementGroup = degreePlan.requirements[key]
        const classElements = requirementGroup.classes?.map(formatClass)
        const classGroups = requirementGroup.groups?.map((g, j) => {
            const groupClasses = g.classes.map(formatClass)
            return (
                <Fragment key={j}>
                    <Tr>
                        {requirementGroup.classes || j > 0 ? (
                            <Th colSpan={5}>
                                {g.title
                                    ? g.title
                                    : `${
                                          g.countRequired
                                      } of the following Course${
                                          g.classes.length > 1 ? 's' : ''
                                      }`}
                                {g.creditHours
                                    ? ` (${g.creditHours} Credit Hours)`
                                    : null}
                            </Th>
                        ) : (
                            <Th colSpan={5}>
                                <CourseGroupHeader>
                                    <Header>
                                        {g.countRequired}{' '}
                                        {requirementGroup.name}
                                    </Header>
                                    {g.creditHours ? (
                                        <Header>
                                            ({g.creditHours} Credit Hours)
                                        </Header>
                                    ) : null}
                                    {requirementGroup.gpaRequired ? (
                                        <Header>
                                            {requirementGroup.gpaRequired.toFixed(
                                                2
                                            )}{' '}
                                            GPA Required
                                        </Header>
                                    ) : null}
                                </CourseGroupHeader>
                            </Th>
                        )}
                    </Tr>
                    {groupClasses}
                </Fragment>
            )
        })
        let creditHours = requirementGroup.classes?.reduce(
            (val, c) => val + +(c?.number.toString()[1] ?? '0'),
            0
        )
        if (creditHours === 0) {
            creditHours = undefined
        }
        return (
            <Fragment key={i}>
                {requirementGroup.classes ||
                (requirementGroup.groups?.length ?? 0) === 0 ? (
                    <Tr>
                        <Th colSpan={5}>
                            <CourseGroupHeader>
                                <Header>{requirementGroup.name}</Header>
                                {creditHours ? (
                                    <Header>
                                        ({creditHours} Credit Hours)
                                    </Header>
                                ) : null}
                                {requirementGroup.gpaRequired ? (
                                    <Header>
                                        {requirementGroup.gpaRequired.toFixed(
                                            2
                                        )}{' '}
                                        GPA Required
                                    </Header>
                                ) : null}
                            </CourseGroupHeader>
                        </Th>
                    </Tr>
                ) : null}
                {classElements}
                {classGroups}
            </Fragment>
        )
    })

    return (
        <Container>
            <Box>
                <Table>
                    <tbody>
                        <Tr>
                            <HeaderCol colSpan={5}>
                                <Header>Degree Plan</Header>
                                <Header>Univeristy of Texas at Dallas</Header>
                                <Header>
                                    Master of {student.transcript?.major}
                                </Header>

                                <br />
                                <Header>{degreePlan.track}</Header>
                                <br />
                                <HeaderContainer>
                                    <LeftBox>
                                        <Header>
                                            Name of Student:{' '}
                                            {student.transcript?.name}
                                        </Header>
                                        <Header>
                                            Student I.D. Number:{' '}
                                            {student.transcript?.id}
                                        </Header>
                                        <Header>
                                            Semester Admitted To Program:{' '}
                                            {
                                                student.transcript
                                                    ?.semesterAdmitted.year
                                            }{' '}
                                            {
                                                student.transcript
                                                    ?.semesterAdmitted.semester
                                            }
                                        </Header>
                                    </LeftBox>
                                    <RightBox>
                                        <Header>
                                            FT :{' '}
                                            {student.additionalInfo
                                                .fastTrack ? (
                                                <CheckBoxOutlined />
                                            ) : (
                                                <CheckBoxOutlineBlankOutlined />
                                            )}
                                        </Header>
                                        <Header>
                                            Thesis :{' '}
                                            {student.additionalInfo.thesis ? (
                                                <CheckBoxOutlined />
                                            ) : (
                                                <CheckBoxOutlineBlankOutlined />
                                            )}
                                        </Header>
                                        <Header>
                                            Anticipated Graduation:{' '}
                                            {
                                                degreePlan.anticipatedGraduation
                                                    ?.year
                                            }{' '}
                                            {
                                                degreePlan.anticipatedGraduation
                                                    ?.semester
                                            }
                                            {degreePlan.anticipatedGraduation
                                                ?.semester ||
                                            degreePlan.anticipatedGraduation
                                                ?.year
                                                ? null
                                                : '_____________'}
                                        </Header>
                                    </RightBox>
                                </HeaderContainer>
                            </HeaderCol>
                        </Tr>
                        <Tr>
                            <Th>Course Title</Th>
                            <Th>Course Number</Th>
                            <Th>UTD Semester</Th>
                            <Th>Transfer</Th>
                            <Th>Grade</Th>
                        </Tr>
                        {groups}
                    </tbody>
                </Table>
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
                        <PrintIcon /> Print
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}
