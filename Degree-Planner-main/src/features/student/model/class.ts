import { Grade } from './grade'

export interface Class {
    prefix: string
    course: number
    name: string
    grade: Grade
    otherGrades: Grade[]
    transfer: boolean
    fastTrack: boolean
}
