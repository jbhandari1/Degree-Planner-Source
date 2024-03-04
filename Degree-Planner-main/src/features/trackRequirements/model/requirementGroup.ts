import { RequiredCourse, RequiredCourseGroup } from '.'

export interface RequirementGroup<T> {
    name: string
    gpaRequired?: number
    groups?: RequiredCourseGroup<T>[]
    classes?: T[]
    suggestedClasses?: RequiredCourse[]
}
