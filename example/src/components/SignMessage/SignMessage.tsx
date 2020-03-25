import React from "react";
import {Button, Typography, Paper, TextField} from '@material-ui/core/';

export const SignMessage = () => {
    return (
        <Paper className="sign-message-container">
            <Typography variant="h4">SIGN CUSTOM MESSAGE</Typography>
            <div className="sign-message-input">
                <TextField fullWidth></TextField>
                <Button color="secondary" >SIGN</Button>
            </div>
        </Paper>
    );
}