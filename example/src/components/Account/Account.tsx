import React from "react";
import {Button, Typography, Card, CardContent, CardHeader, Grid, Divider, Box} from '@material-ui/core/';

export const Account = () => {
    return (
        <Card>
            <CardHeader title="Account details"/>
            <CardContent>
                <Grid container alignItems="center">
                    <Grid item md={6} xs={12}>
                        <Typography variant="h6">ADDRESS:</Typography>
                        <Typography variant="subtitle2">0XDC25EF3F5B8A186998338A2ADA83795FBA27D695E</Typography>
                        <Divider light/>
                        <Box m={"0.5rem"}/>
                        <Typography variant="h6">ACCOUNT BALANCE:</Typography>
                        <Typography variant="subtitle2">354.01 KSM</Typography>
                    </Grid>
                </Grid>
                <Grid container item xs={12} justify="flex-end">
                    <Button color="secondary" variant={"contained"}>Export private key</Button>
                </Grid>
            </CardContent>
        </Card>
    );
}