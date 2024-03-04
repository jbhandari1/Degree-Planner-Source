import { createSlice } from '@reduxjs/toolkit'
import loadRequirements from './loadRequirements'
import { TrackRequirements } from './model'

const initialState: { [key: string]: TrackRequirements } = {}

const trackRequirementsSlice = createSlice({
    name: 'trackRequirements',
    initialState,
    reducers: {},
    extraReducers: (builder) =>
        builder.addCase(loadRequirements.fulfilled, (state, action) => {
            state = {}
            action.payload.forEach(
                (requirements) => (state[requirements.name] = requirements)
            )
            return state
        }),
})

export default trackRequirementsSlice.reducer
