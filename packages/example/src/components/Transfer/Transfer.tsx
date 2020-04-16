import React from "react";
import {Box, Button, Card, CardContent, CardHeader, Grid, TextField} from '@material-ui/core/';

export const Transfer = () => {
    return (
        <Card>
            <CardContent>
                <CardHeader title="Transfer"/>
                <Grid container alignItems="center" justify="space-between">
                    <Grid item xs={12}>
                        <TextField size="medium" fullWidth id="recipient" label="Recipient" variant="outlined" />
                        <Box m="0.5rem"/>
                        <TextField size="medium" fullWidth id="recipient" label="Amount" variant="outlined" />
                    </Grid>
                </Grid>
                <Box m="0.5rem"/>
                <Grid container item xs={12} justify="flex-end">
                    <Button color="secondary" variant="contained" size="large">SEND</Button>
                </Grid>
            </CardContent>
        </Card>
    );
}