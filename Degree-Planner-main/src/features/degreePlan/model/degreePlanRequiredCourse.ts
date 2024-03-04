import { RequiredCourse } from '../../trackRequirements/model'

export interface DegreePlanRequiredCourse {
    name: string
    prefix: string
    number: number
    default: RequiredCourse
}
