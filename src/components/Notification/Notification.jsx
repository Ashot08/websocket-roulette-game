import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import {useEffect} from "react";
import {Alert} from "@mui/material";

export default function Notification(props) {
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        setOpen(props.isOpen);
    }, [props.isOpen]);

    const handleClose = props.onClose;

    return (
        <div>
            <Snackbar open={open} autoHideDuration={12000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={props.status || 'success'} sx={{ width: '100%'}}>
                    {props.text}
                </Alert>
            </Snackbar>
            {/*<Alert severity="error">This is an error message!</Alert>*/}
            {/*<Alert severity="warning">This is a warning message!</Alert>*/}
            {/*<Alert severity="info">This is an information message!</Alert>*/}
            {/*<Alert severity="success">This is a success message!</Alert>*/}
        </div>
    );
}
