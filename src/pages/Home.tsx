import { Box, Fab } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { useRef } from 'react'
import { ImportExport, Upload } from '@mui/icons-material'
import importTranscript from '../features/student/importTranscript'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import importSave from '../features/importSave'

export default function Home() {
    const [transcriptLoaded, degreePlanLoaded] = useAppSelector((state) => [
        state.student.transcript !== undefined,
        state.degreePlan.loaded,
    ])
    const dispatch = useAppDispatch()
    const transcriptInput = useRef<HTMLInputElement>(null)
    const studentDataInput = useRef<HTMLInputElement>(null)

    const studentDataFileSelected = (files: FileList | null) => {
        if (!files) {
            return
        }
        dispatch(importSave(files[0]))
    }
    const transcriptFileSelected = (files: FileList | null) => {
        if (!files) {
            return
        }
        dispatch(importTranscript(files[0]))
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <h2>Select an option below</h2>
            {transcriptLoaded ? (
                degreePlanLoaded ? (
                    <Navigate to={'/degreePlan'} />
                ) : (
                    <Navigate to={'/additionalInfo'} />
                )
            ) : undefined}

            <Box
                sx={{
                    display: 'flex',
                    alignSelf: 'stretch',
                    justifyContent: 'center',
                    gap: '20px',
                }}
            >
                <input
                    type="file"
                    ref={studentDataInput}
                    style={{ display: 'none' }}
                    accept="application/JSON"
                    onChange={(e) => studentDataFileSelected(e.target.files)}
                />
                <Fab
                    variant="extended"
                    size="large"
                    onClick={() => {
                        studentDataInput.current?.click()
                    }}
                    title="Upload Student Data"
                >
                    <Upload />
                    Upload Student Data
                </Fab>

                <input
                    type="file"
                    ref={transcriptInput}
                    style={{ display: 'none' }}
                    accept="application/pdf"
                    onChange={(e) => transcriptFileSelected(e.target.files)}
                />
                <Fab
                    variant="extended"
                    size="large"
                    onClick={() => {
                        transcriptInput.current?.click()
                    }}
                    title="Import Transcript"
                >
                    <ImportExport />
                    Import Transcript
                </Fab>
            </Box>
        </Box>
    )
}
