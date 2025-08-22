import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"

export const SuccessOrFailMessage = (props) => {
    return(
        <Snackbar 
            open={props.open} 
            autoHideDuration={4000} 
            onClose={props.onClose} 
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
        >
            <Alert
                severity={props.severity}
                variant="filled"
                onClose={props.onClose}
                sx={{ width: '100%' }}
            >
                {props.message}
            </Alert>
        </Snackbar>
    )
}