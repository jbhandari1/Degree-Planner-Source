import { createAsyncThunk } from '@reduxjs/toolkit'
import { DegreePlanState } from './model'
import { RootState } from '../../app/store'
import { RequirementGroup } from '../trackRequirements/model'
import { DegreePlanRequiredCourse } from './model'

const setupDegreePlan = createAsyncThunk(
    'degreePlan/setup',
    async (trackName: string, { getState }): Promise<DegreePlanState> => {
        let state = getState() as RootState
        let trackRequirements =
            state.trackRequirements[state.student.additionalInfo.track]

        let requirements: {
            [key: string]: RequirementGroup<DegreePlanRequiredCourse>
        } = {}

        const takenClasses = Object.keys(
            trackRequirements.requirements
        ).flatMap((key) => {
            return (trackRequirements.requirements[key].classes ?? []).concat(
                trackRequirements.requirements[key].groups?.flatMap(
                    (g) => g.classes
                ) ?? []
            )
        })

        Object.keys(trackRequirements.requirements).forEach((key) => {
            const last = trackRequirements.requirements[key]
            requirements[key] = {
                ...last,
                groups: last.groups?.map((g) => ({
                    ...g,
                    classes: g.classes
                        .map((c) => ({
                            ...c,
                            default: c,
                            modified: false,
                        }))
                        .concat(
                            last.suggestedClasses
                                ?.filter(
                                    (c) =>
                                        state.student.transcript?.classes[
                                            `${c.prefix} ${c.number}`
                                        ] &&
                                        takenClasses.findIndex(
                                            (c2) =>
                                                c.number === c2.number &&
                                                c.prefix === c2.prefix
                                        ) < 0
                                )
                                .map((c) => ({
                                    ...c,
                                    default: c,
                                    modified: false,
                                })) ?? []
                        )
                        .concat(
                            g.preload
                                ? Object.entries(
                                      state.student.transcript?.classes ?? {}
                                  )
                                      .filter(
                                          ([k, v]) =>
                                              k.match(g.preload!) &&
                                              takenClasses.findIndex(
                                                  (c2) =>
                                                      v.prefix === c2.prefix &&
                                                      v.course === c2.number
                                              ) < 0
                                      )
                                      .map(([_, v]) => ({
                                          name: v.name,
                                          prefix: v.prefix,
                                          number: v.course,
                                          default: {
                                              name: v.name,
                                              prefix: v.prefix,
                                              number: v.course,
                                          },
                                          modified: false,
                                      }))
                                : []
                        ),
                })),
                classes: last.classes
                    ?.map((c) => ({
                        ...c,
                        default: c,
                        modified: false,
                    }))
                    .concat(
                        last.suggestedClasses
                            ?.filter(
                                (c) =>
                                    state.student.transcript?.classes[
                                        `${c.prefix} ${c.number}`
                                    ] &&
                                    takenClasses.findIndex(
                                        (c2) =>
                                            c.number === c2.number &&
                                            c.prefix === c2.prefix
                                    ) < 0
                            )
                            .map((c) => ({
                                ...c,
                                default: c,
                                modified: false,
                            })) ?? []
                    ),
            }
        })

        return {
            major: trackRequirements.major,
            track: trackRequirements.name,
            requirements,
            classOverrides: {},
            loaded: true,
        }
    }
)
export default setupDegreePlan
