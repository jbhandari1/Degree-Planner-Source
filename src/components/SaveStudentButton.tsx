import { Save } from '@mui/icons-material'
import { Box, Fab } from '@mui/material'
import { useAppSelector } from '../app/hooks'
import { useSnackbar } from 'notistack'
import { SaveData } from '../features/saveData'
import version from '../version'

export default function SaveStudentButton() {
    const { transcript, additionalInfo, degreePlan } = useAppSelector(
        (state) => ({
            transcript: state.student.transcript,
            additionalInfo: state.student.additionalInfo,
            degreePlan: state.degreePlan,
        })
    )
    const { enqueueSnackbar } = useSnackbar()

    const downloadJson = () => {
        if (!transcript || !additionalInfo) {
            enqueueSnackbar('Failed to save partal student', {
                preventDuplicate: true,
                variant: 'error',
            })
            return
        }
        const saveData: SaveData = {
            version,
            transcript,
            additionalInfo,
            degreePlan,
        }
        const element = document.createElement('a')
        const file = new Blob([JSON.stringify(saveData)], {
            type: 'application/json',
        })
        element.href = URL.createObjectURL(file)
        element.download = `${transcript.name}-${transcript.id}-DegreePlan.json`
        document.body.appendChild(element) // Required for this to work in FireFox
        element.click()
    }

    return (
        <Box>
            <Fab variant="extended" size="large" onClick={downloadJson}>
                <Save />
                Save
            </Fab>
        </Box>
    )
}
