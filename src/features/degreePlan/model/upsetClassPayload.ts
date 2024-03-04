import { CourseIdentifier } from '.'
import { RequiredCourse } from '../../trackRequirements/model'

export interface UpsetClassPayload {
    id: CourseIdentifier
    value: RequiredCourse
}
