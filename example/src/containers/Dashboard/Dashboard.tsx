import React, {useState} from "react";
import {Container, Button, Typography, Grid, Hidden, Card, CardContent, CardHeader } from '@material-ui/core/';
import {Transfer} from "../../components/Transfer/Transfer";
import {SignMessage} from "../../components/SignMessage/SignMessage";
import {TransactionTable} from "../../components/TransactionTable/TransactionTable";
import {Account} from "../../components/Account/Account";

export const Dashboard = () => {
    const [connected, setConnected]=useState<boolean>(false);

    return (
        <Container maxWidth="lg" >
            <Grid direction="column" alignItems="center" justify="center" container spacing={3}>
                    <Typography variant="h2">
                        Metamask - Polkadot Snap
                    </Typography>
                <Hidden xsUp={connected}>
                    <Button onClick={() => setConnected(true)} color="primary">Connect</Button>
                </Hidden>
                <Hidden xsUp={!connected}>
                    <Grid container xs={12} spacing={3} alignItems="center">
                        <Grid item md={6} xs={12}>
                            <Transfer/>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <SignMessage/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Account/>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                        <CardHeader title="Account transactions"/>
                            <CardContent>
                                <TransactionTable/>
                            </CardContent>
                        </Card>
                    </Grid>
                </Hidden>
            </Grid>
        </Container>
    );
}