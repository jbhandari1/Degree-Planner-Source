import { TrackRequirements } from './features/trackRequirements/model'

export {}
declare global {
    interface Window {
        degreeRequirements?: {
            load(): Promise<TrackRequirements[]>
        }
    }

    interface Array<T> {
        // This is in node js, but not typescript
        findLastIndex(
            predicate: (value: T, index: number, obj: T[]) => unknown,
            thisArg?: any
        ): number
    }
}
