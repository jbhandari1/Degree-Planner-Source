import { createSlice } from '@reduxjs/toolkit'
import importSave from '../importSave'
import importTranscript from '../student/importTranscript'
import { GlobalState } from './model'
import WrappedExtraReducersBuilder from './wrappedExtraReducersBuilder'

const globalInitialState: GlobalState = {
    loading: 0,
}

export const globalSlice = createSlice({
    name: 'global',
    initialState: globalInitialState,
    reducers: {},
    extraReducers: (builder) =>
        new WrappedExtraReducersBuilder(builder)
            .addThunk(
                importTranscript,
                'Importing Transcript',
                'Successfully Imported Transcript',
                'Failed to Import Transcript'
            )
            .addThunk(
                importSave,
                'Loading Student',
                'Successfully Loaded Student',
                'Failed to Load Student'
            ),
})

export default globalSlice.reducer
