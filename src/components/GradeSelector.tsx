import { Grade } from '../features/student/model/grade'
import SemesterSelector from './SemesterSelector'
import { Autocomplete, Box, Button, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Add, Remove } from '@mui/icons-material'

interface GradeSelectorProps {
    disabled?: boolean
    grade?: Grade
    addDisabled?: boolean
    onAdd?: () => void
    onRemove?: () => void
    onChange?: (value: Grade) => void
}

const grades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'F', 'I', 'P'].map(
    (g) => ({
        label: g,
    })
)

export default function GradeSelector(props: GradeSelectorProps) {
    const [grade, setGrade] = useState(props.grade?.grade)
    useEffect(() => setGrade(props.grade?.grade), [props.grade?.grade])

    const onGradeChange = (value?: string | { label: string }) => {
        const newGrade =
            typeof value === 'string' ? value : value?.label ?? undefined
        setGrade(newGrade)
        if (!props.onChange) {
            return
        }
        props.onChange({
            semester: props.grade?.semester,
            grade:
                newGrade?.trim() === ''
                    ? undefined
                    : newGrade?.trim().toUpperCase(),
        })
    }
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
            <SemesterSelector
                disabled={props.disabled}
                semester={props.grade?.semester}
                onChange={(value) => {
                    if (!props.onChange) {
                        return
                    }
                    props.onChange({
                        semester: value,
                        grade: props.grade?.grade,
                    })
                }}
            />
            <Autocomplete
                disabled={props.disabled}
                options={grades}
                sx={{ width: 100 }}
                title="Grade"
                freeSolo
                handleHomeEndKeys
                renderInput={(params) => (
                    <TextField
                        {...params}
                        onBlur={(event) => {
                            onGradeChange(event.target.value)
                        }}
                        label="Grade"
                    />
                )}
                value={grades.find((g) => g.label === grade) ?? ''}
                onChange={(_, value) => {
                    onGradeChange(value ?? undefined)
                }}
            />
            {props.onAdd ? (
                <Button
                    disabled={props.disabled || props.addDisabled}
                    title="Add Grade"
                    onClick={props.onAdd}
                    variant="text"
                    size="small"
                    sx={{ minWidth: '' }}
                >
                    <Add />
                </Button>
            ) : undefined}
            {props.onRemove ? (
                <Button
                    disabled={props.disabled}
                    title="Remove Grade"
                    onClick={props.onRemove}
                    variant="text"
                    size="small"
                    sx={{ minWidth: '' }}
                >
                    <Remove />
                </Button>
            ) : undefined}
        </Box>
    )
}
