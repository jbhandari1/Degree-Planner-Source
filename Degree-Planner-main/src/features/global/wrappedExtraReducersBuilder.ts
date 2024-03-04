import {
    ActionReducerMapBuilder,
    AsyncThunk,
    PayloadAction,
    SerializedError,
} from '@reduxjs/toolkit'
import { enqueueSnackbar, closeSnackbar } from 'notistack'
import { GlobalState } from './model'

// NOTE: this is really against redux principles to add notifications to the snackbar here but idc at the moment

type Action<T, E = never> = PayloadAction<
    unknown,
    string,
    {
        arg: unknown
        requestId: string
        requestStatus: T
    },
    E
>

function handlePending(loadingMessage?: string) {
    return (state: GlobalState, action: Action<'pending'>) => {
        state.loading++
        if (loadingMessage) {
            enqueueSnackbar(loadingMessage, {
                key: action.meta.requestId,
                persist: true,
                preventDuplicate: true,
                variant: 'info',
            })
        }
    }
}

function handleFulfilled(suscessMessage?: string) {
    return (state: GlobalState, action: Action<'fulfilled'>) => {
        state.loading--
        if (suscessMessage) {
            closeSnackbar(action.meta.requestId)
            enqueueSnackbar(suscessMessage, {
                key: action.meta.requestId + 'F',
                preventDuplicate: true,
                variant: 'success',
            })
        }
    }
}

function handleRejected(errorMessagePrefix?: string) {
    return (
        state: GlobalState,
        action: Action<'rejected', SerializedError>
    ) => {
        state.loading--
        console.error(action.error)
        if (errorMessagePrefix) {
            closeSnackbar(action.meta.requestId)
            enqueueSnackbar(`${errorMessagePrefix}: ${action.error.message}`, {
                key: action.meta.requestId + 'R',
                persist: true,
                preventDuplicate: true,
                variant: 'error',
            })
        }
    }
}

export default class WrappedExtraReducersBuilder {
    constructor(public builder: ActionReducerMapBuilder<GlobalState>) {}

    addThunk(
        thunk: AsyncThunk<any, any, { serializedErrorType?: unknown }>,
        loadingMessage?: string,
        suscessMessage?: string,
        errorMessagePrefix?: string
    ): WrappedExtraReducersBuilder {
        this.builder
            .addCase(thunk.pending, handlePending(loadingMessage))
            .addCase(thunk.fulfilled, handleFulfilled(suscessMessage))
            .addCase(thunk.rejected, handleRejected(errorMessagePrefix))
        return this
    }
}
