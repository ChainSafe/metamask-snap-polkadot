import React from "react";
import {Button, Typography, Paper, TextField} from '@material-ui/core/';

export const Transfer = () => {
    return (
        <Paper className="transfer-container">
            <Typography variant="h4">TRANSFER</Typography>
            <div className="transfer-items">
                <div className="transfer-input">
                    <Typography variant="h6">TO ADRESS</Typography>
                    <TextField fullWidth></TextField>
                    <Typography variant="h6">AMOUNT</Typography>
                    <TextField fullWidth></TextField>
                </div>
                <Button color="secondary" size="large">SEND</Button>
            </div>
        </Paper>
        
    );
}