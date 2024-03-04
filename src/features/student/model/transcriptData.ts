import { Class, SemesterYear } from '.'

export interface TranscriptData {
    name: string
    id: string
    major: string
    semesterAdmitted: SemesterYear
    classes: { [key: string]: Class }
}
