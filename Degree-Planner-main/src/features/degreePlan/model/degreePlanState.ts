import { Class, SemesterYear } from '../../student/model'
import { RequirementGroup } from '../../trackRequirements/model'
import { DegreePlanRequiredCourse } from './'

export interface DegreePlanState {
    major: string
    track: string
    requirements: { [key: string]: RequirementGroup<DegreePlanRequiredCourse> }
    classOverrides: { [key: string]: Class }
    loaded: boolean
    anticipatedGraduation?: SemesterYear
}
