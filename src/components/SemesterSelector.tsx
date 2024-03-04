import { Autocomplete, Box, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Semester, SemesterYear } from '../features/student/model'

interface SemesterSelectorProps {
    semester?: SemesterYear
    semesterLabel?: string
    yaerLabel?: string
    semesterWidth?: number
    yearWidth?: number
    disabled?: boolean
    disableClearable?: boolean
    onChange?: (value?: SemesterYear) => void
}

export default function SemesterSelector(props: SemesterSelectorProps) {
    const [year, setYear] = useState(props.semester?.year)

    useEffect(() => {
        setYear(props.semester?.year)
    }, [props.semester])

    const semesters = Object.values(Semester)
        .filter((s) => s !== 'N/A')
        .map((s) => ({
            label: s,
        }))

    return (
        <Box sx={{ display: 'flex', gap: '10px' }}>
            <Autocomplete
                disabled={props.disabled}
                options={semesters}
                sx={{ width: props.semesterWidth ?? 150 }}
                title={props.semesterLabel ?? 'Semester'}
                disableClearable={props.disableClearable}
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label={props.semesterLabel ?? 'Semester'}
                        />
                    )
                }}
                value={
                    semesters.find(
                        (s) => s.label === props.semester?.semester
                    ) ?? null
                }
                onChange={(_, value) => {
                    if (props.onChange) {
                        props.onChange({
                            semester: value?.label as Semester | undefined,
                            year: year,
                        })
                    }
                }}
            />
            <TextField
                disabled={props.disabled}
                sx={{ width: props.yearWidth ?? 90 }}
                label={props.yaerLabel ?? 'Year'}
                title={props.yaerLabel ?? 'Year'}
                type={'number'}
                value={year ?? ''}
                onChange={(e) => {
                    const value =
                        +e.target.value ||
                        (props.disableClearable ? year : undefined)
                    if (
                        props.onChange &&
                        Math.abs(+e.target.value - (year ?? 0)) === 1
                    ) {
                        props.onChange({
                            semester: props.semester?.semester,
                            year: value,
                        })
                    }
                    setYear(value)
                }}
                onBlur={(e) => {
                    e.target.value = (+e.target.value).toString()
                    if (props.semester?.year !== year && props.onChange) {
                        props.onChange({
                            semester: props.semester?.semester,
                            year,
                        })
                    }
                }}
            />
        </Box>
    )
}
