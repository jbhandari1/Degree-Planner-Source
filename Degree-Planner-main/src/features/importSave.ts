import { createAsyncThunk } from '@reduxjs/toolkit'
import { majorVersion, minorVersion, patchVersion } from '../version'
import { SaveData } from './saveData'

const importSave = createAsyncThunk(
    'importSave',
    async (file: Blob): Promise<SaveData> => {
        const saveData = JSON.parse(await file.text()) as SaveData
        if (
            !saveData.additionalInfo ||
            !saveData.transcript ||
            !saveData.degreePlan
        ) {
            throw new Error('Invalid save file')
        }
        const saveVersionSplit = saveData.version.split('.').map((v) => +v)
        if (
            saveVersionSplit[0] > majorVersion ||
            (saveVersionSplit[0] === majorVersion &&
                (saveVersionSplit[1] > minorVersion ||
                    (saveVersionSplit[1] === minorVersion &&
                        saveVersionSplit[2] > patchVersion)))
        ) {
            throw new Error('Save file is from a newer version. Please Update')
        }
        return saveData
    }
)
export default importSave
