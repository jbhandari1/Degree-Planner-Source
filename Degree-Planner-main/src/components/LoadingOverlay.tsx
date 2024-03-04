import { Backdrop, CircularProgress } from '@mui/material'
import { useAppSelector } from '../app/hooks'

export default function LoadingOverlay() {
    const loading = useAppSelector((state) => state.global.loading)

    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loading > 0}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}
