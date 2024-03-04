import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface DevState {
    value: number
}

// Define the initial state using that type
const initialState: DevState = {
    value: 0,
}

export const devSlice = createSlice({
    name: 'dev',
    initialState,
    reducers: {
        increment: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value += 1
        },
        decrement: (state) => {
            state.value -= 1
        },
        setValue: (state, action: PayloadAction<number>) => {
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, setValue } = devSlice.actions

export default devSlice.reducer
