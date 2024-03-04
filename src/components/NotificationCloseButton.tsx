import { Close } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useSnackbar, SnackbarKey } from 'notistack'

function NotificationCloseButton({
    snackbarKey,
}: {
    snackbarKey: SnackbarKey
}) {
    const { closeSnackbar } = useSnackbar()

    return (
        <IconButton onClick={() => closeSnackbar(snackbarKey)}>
            <Close />
        </IconButton>
    )
}

export default NotificationCloseButton
