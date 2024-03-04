import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import importSave from '../importSave'
import reset from '../reset'
import { Class, SemesterYear } from '../student/model'
import { CourseIdentifier, DegreePlanState, UpsetClassPayload } from './model'
import setupDegreePlan from './setupDegreePlan'

const initialState: DegreePlanState = {
    major: '',
    track: '',
    requirements: {},
    classOverrides: {},
    loaded: false,
}

const degreePlanSlice = createSlice({
    name: 'degreePlan',
    initialState,
    reducers: {
        setAnticipatedGraduation: (
            state,
            action: PayloadAction<SemesterYear | undefined>
        ) => {
            state.anticipatedGraduation = action.payload
        },
        updateClassOverride: (state, action: PayloadAction<Class>) => {
            state.classOverrides[
                `${action.payload.prefix} ${action.payload.course}`
            ] = action.payload
        },
        clearClassOverride: (state, action: PayloadAction<string>) => {
            delete state.classOverrides[action.payload]
        },
        removeCourse: (state, action: PayloadAction<CourseIdentifier>) => {
            const group = state.requirements[action.payload.groupName]
            if (action.payload.group !== undefined) {
                if (!group.groups) {
                    throw new Error('Failed to find course to remove')
                }
                group.groups[action.payload.group].classes.splice(
                    action.payload.index,
                    1
                )
            } else {
                group.classes?.splice(action.payload.index, 1)
            }
        },

        upsertCourse: (state, action: PayloadAction<UpsetClassPayload>) => {
            const group = state.requirements[action.payload.id.groupName]
            let classToEdit
            if (action.payload.id.group !== undefined) {
                if (!group.groups) {
                    throw new Error('Failed to find course to edit')
                }
                classToEdit =
                    group.groups[action.payload.id.group].classes[
                        action.payload.id.index
                    ]
            } else {
                classToEdit = group.classes
                    ? group.classes[action.payload.id.index]
                    : undefined
            }
            if (!classToEdit) {
                if (action.payload.id.group !== undefined) {
                    if (!group.groups) {
                        throw new Error('Failed to find course to edit')
                    }
                    classToEdit = group.groups[
                        action.payload.id.group
                    ].classes.push({
                        ...action.payload.value,
                        default: action.payload.value,
                    })
                } else {
                    group.classes?.push({
                        ...action.payload.value,
                        default: action.payload.value,
                    })
                }
                return
            }
            classToEdit.name = action.payload.value.name
            classToEdit.number = action.payload.value.number
            classToEdit.prefix = action.payload.value.prefix
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(setupDegreePlan.fulfilled, (_, action) => action.payload)
            .addCase(
                importSave.fulfilled,
                (state, action) => action.payload.degreePlan
            )
            .addCase(reset, () => initialState),
})

export default degreePlanSlice.reducer
export const {
    clearClassOverride,
    removeCourse,
    setAnticipatedGraduation,
    updateClassOverride,
    upsertCourse,
} = degreePlanSlice.actions
