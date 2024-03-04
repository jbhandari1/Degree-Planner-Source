import { Class, TranscriptData } from '../student/model'
export interface PredictedGrades {
    avgGrade?: number
    classes: Class[]
}
let gpaValues: { [name: string]: number } = {
    'A+': 4.0,
    A: 4,
    'A-': 3.67,
    'B+': 3.33,
    B: 3.0,
    'B-': 2.67,
    'C+': 2.33,
    C: 2.0,
    'C-': 1.67,
    'D+': 1.33,
    D: 1,
    'D-': 0.67,
    F: 0,
}

function getHours(transcript: TranscriptData) {
    let weightedHours = 0
    let aggHours = 0
    let classagg = Object.keys(transcript.classes).map(
        (key) => transcript.classes[key]
    )
    classagg.forEach(({ course, grade }) => {
        if (
            grade.grade !== 'P' &&
            grade.grade !== 'I' &&
            grade.grade !== undefined
        ) {
            weightedHours =
                weightedHours +
                gpaValues[grade.grade as string] * +course.toString().charAt(1)
            aggHours = aggHours + +course.toString().charAt(1)
        }
    })

    return [weightedHours, aggHours]
}

export function getGPA(transcript: TranscriptData) {
    let [weightedHours, aggHours] = getHours(transcript)
    return (weightedHours / aggHours).toFixed(3)
}

export function requiredGrades(
    transcript: TranscriptData,
    requiredGPA?: number
) {
    let defaultGPA = 3.15

    if (requiredGPA === undefined) requiredGPA = defaultGPA

    let [weightedHours, aggHours] = getHours(transcript)

    let inprogressClasses = Object.keys(transcript.classes)
        .map((key) => transcript.classes[key])
        .filter(({ grade }) => grade.grade === undefined)

    let prediction: PredictedGrades = { classes: inprogressClasses }

    let inprogressAggHours = 0
    inprogressClasses.forEach(({ course }) => {
        inprogressAggHours = inprogressAggHours + +course.toString().charAt(1)
    })

    let inprogressWeightedHours =
        requiredGPA * (aggHours + inprogressAggHours) - weightedHours

    let inprogressGPA = inprogressWeightedHours / inprogressAggHours
    prediction.avgGrade = inprogressGPA
    return prediction
}
