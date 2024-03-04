export interface RequiredCourseGroup<T> {
    title?: string
    countRequired?: number
    creditHours?: number
    classes: T[]
    preload?: string
}
