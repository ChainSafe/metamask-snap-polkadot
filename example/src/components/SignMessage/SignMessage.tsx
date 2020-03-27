import React from "react";
import {Button, TextField, Card, CardContent, CardHeader, Grid} from '@material-ui/core/';

export const SignMessage = () => {
    return (
        <Card>
            <CardContent>
            <CardHeader title="Sign custom message"/>
                <Grid container>
                    <Grid item xs={10}>
                        <TextField fullWidth></TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <Button color="secondary" >SIGN</Button>
                    </Grid> 
                </Grid>
            </CardContent>
        </Card>
    );
}