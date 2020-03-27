import React from "react";
import {Button, TextField, Card, CardContent, CardHeader, Grid, Box} from '@material-ui/core/';

export const SignMessage = () => {
    return (
        <Card style={{height: "100%"}}>
            <CardHeader title="Sign custom message"/>
            <CardContent>
                <Grid container>
                    <TextField size="medium" fullWidth id="recipient" label="Message" variant="outlined" />
                </Grid>
                <Box m="0.5rem" />
                <Grid container justify="flex-end">
                    <Button color="secondary" variant="contained" size="large">Sign</Button>
                </Grid>
            </CardContent>
        </Card>
    );
}