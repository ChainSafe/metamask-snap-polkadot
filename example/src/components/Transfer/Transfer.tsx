import React from "react";
import {Button, Typography, TextField, Card, CardContent, CardHeader, Grid} from '@material-ui/core/';

export const Transfer = () => {
    return (
        <Card>
            <CardContent>
                <CardHeader title="Transfer"/>
                <Grid container alignItems="center" justify="space-between">
                    <Grid item xs={9}>
                        <Typography variant="h6">TO ADRESS</Typography>
                        <TextField fullWidth></TextField>
                        <Typography variant="h6">AMOUNT</Typography>
                        <TextField fullWidth></TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <Button color="secondary" size="large">SEND</Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}