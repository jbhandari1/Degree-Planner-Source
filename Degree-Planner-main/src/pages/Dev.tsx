import { Box, Button, ButtonGroup, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { decrement, increment, setValue } from '../features/dev/devSlice'

export default function Dev() {
    const count = useAppSelector((state) => state.dev.value)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box>
                <h2>Pages:</h2>
                <ButtonGroup variant="contained">
                    <Button onClick={() => navigate('/')}>Home</Button>
                    <Button onClick={() => navigate('/additionalInfo')}>
                        Additional Info
                    </Button>
                    <Button onClick={() => navigate('/degreePlan')}>
                        Degree Plan
                    </Button>
                    <Button onClick={() => navigate('/print')}>Print</Button>
                </ButtonGroup>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <h2>Redux Example</h2>
                <h3>{count}</h3>
                <TextField
                    type="number"
                    value={count}
                    margin="normal"
                    onChange={(e) => dispatch(setValue(+e.target.value))}
                >
                    Value
                </TextField>
                <ButtonGroup variant="contained">
                    <Button onClick={() => dispatch(decrement())}>-</Button>
                    <Button onClick={() => dispatch(increment())}>+</Button>
                </ButtonGroup>
            </Box>
        </Box>
    )
}
