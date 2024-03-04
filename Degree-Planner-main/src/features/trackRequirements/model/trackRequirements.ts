import { RequiredCourse } from './requiredCourse'
import { RequirementGroup } from './requirementGroup'

export interface TrackRequirements {
    name: string
    major: string
    requirements: { [key: string]: RequirementGroup<RequiredCourse> }
}
