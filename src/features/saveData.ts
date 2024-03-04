import { DegreePlanState } from './degreePlan/model'
import { AdditionalInfo, TranscriptData } from './student/model'

export interface SaveData {
    version: string
    transcript: TranscriptData
    additionalInfo: AdditionalInfo
    degreePlan: DegreePlanState
}
