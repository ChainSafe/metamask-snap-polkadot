import React, {useState} from "react";
import {Container, Button, Typography, Grid, Hidden, Card, CardContent, CardHeader, Box} from '@material-ui/core/';
import {Transfer} from "../../components/Transfer/Transfer";
import {SignMessage} from "../../components/SignMessage/SignMessage";
import {TransactionTable} from "../../components/TransactionTable/TransactionTable";
import {Account} from "../../components/Account/Account";

export const Dashboard = () => {
    const [connected, setConnected]=useState<boolean>(false);

    return (
        <Container maxWidth="lg" >
            <Grid direction="column" alignItems="center" justify="center" container spacing={3}>
                <Box m="2rem">
                    <Typography variant="h2">
                        Polkadot snap demo
                    </Typography>
                </Box>
                <Hidden xsUp={connected}>
                    <Button onClick={() => setConnected(true)} variant="contained" size={"large"} color="primary">Connect</Button>
                </Hidden>
                <Hidden xsUp={!connected}>
                    <Grid container xs={12} spacing={3} alignItems="stretch">
                        <Grid item xs={12}>
                            <Account/>
                        </Grid>
                    </Grid>
                    <Box m="1rem"/>
                    <Grid container xs={12} spacing={3} alignItems="stretch">
                        <Grid item md={6} xs={12}>
                            <Transfer/>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <SignMessage/>
                        </Grid>
                    </Grid>
                    <Box m="1rem"/>
                    <Grid container xs={12} spacing={3} alignItems={"stretch"}>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader title="Account transactions"/>
                                <CardContent>
                                    <TransactionTable/>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Hidden>
            </Grid>
        </Container>
    );
}