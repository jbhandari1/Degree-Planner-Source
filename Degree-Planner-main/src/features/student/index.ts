import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import importSave from '../importSave'
import reset from '../reset'
import importTranscript from './importTranscript'
import { SemesterYear, StudentState } from './model'

const initialState: StudentState = {
    additionalInfo: {
        track: '',
        fastTrack: false,
        thesis: false,
    },
}

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        setAdmission: (state, action: PayloadAction<SemesterYear>) => {
            state.transcript!.semesterAdmitted = action.payload
        },
        setTrack: (state, action: PayloadAction<string>) => {
            state.additionalInfo.track = action.payload
        },
        setFastTrack: (state, action: PayloadAction<boolean>) => {
            state.additionalInfo.fastTrack = action.payload
        },
        setThesis: (state, action: PayloadAction<boolean>) => {
            state.additionalInfo.thesis = action.payload
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(importTranscript.fulfilled, (state, action) => {
                state.transcript = action.payload.transcript
                state.additionalInfo.track = action.payload.track
            })
            .addCase(importSave.fulfilled, (state, action) => {
                state.transcript = action.payload.transcript
                state.additionalInfo = action.payload.additionalInfo
            })
            .addCase(reset, () => initialState),
})

export default studentSlice.reducer

export const { setTrack, setFastTrack, setThesis, setAdmission } =
    studentSlice.actions
