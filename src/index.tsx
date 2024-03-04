import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Dev from './pages/Dev'
import reportWebVitals from './reportWebVitals'
import { SnackbarProvider } from 'notistack'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import AdditionalInformation from './pages/AdditionalInformation'
import Home from './pages/Home'
import Print from './pages/Print'
import DegreePlan from './pages/DegreePlan'
import Audit from './pages/Audit'
import NotificationCloseButton from './components/NotificationCloseButton'
import LoadingOverlay from './components/LoadingOverlay'
import loadRequirements from './features/trackRequirements/loadRequirements'

const router = createHashRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/additionalInfo',
        element: <AdditionalInformation />,
    },
    {
        path: '/audit',
        element: <Audit />,
    },
    {
        path: '/dev',
        element: <Dev />,
    },
    {
        path: '/print',
        element: <Print />,
    },
    {
        path: '/degreePlan',
        element: <DegreePlan />,
    },
])

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
})

store.dispatch(loadRequirements())

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <RouterProvider router={router} />
                <LoadingOverlay />
                <SnackbarProvider
                    maxSnack={5}
                    action={(snackbarKey) => (
                        <NotificationCloseButton snackbarKey={snackbarKey} />
                    )}
                />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
