import React, {useState} from "react";
import {Container, Button, Typography, Grid, Paper, Hidden } from '@material-ui/core/';
import {Transfer} from "../../components/Transfer/Transfer";
import {SignMessage} from "../../components/SignMessage/SignMessage";
import {TransactionTable} from "../../components/TransactionTable/TransactionTable";

export const Dashboard = () => {
    const [connected, setConnected]=useState<boolean>(false);

    return (
        <Container maxWidth="md" >
            <Grid direction="column" alignItems="center" justify="center" container spacing={3}>
                    <Typography variant="h2">
                        Metamask - Polkadot Snap
                    </Typography>
                <Hidden xsUp={connected}>
                    <Button onClick={() => setConnected(true)} color="primary">Connect</Button>
                </Hidden>
                <Hidden xsUp={!connected}>
                    <Grid container xs={12} spacing={3}>
                        <Grid item md={6} xs={12}>
                            <Transfer/>
                        </Grid>
                        <Grid container direction="column" alignItems="center" justify="center" item md={6} xs={12}>
                                <Button className="export-private-key" color="secondary">Export private key</Button>
                                <SignMessage/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            <Grid container direction="column" alignItems="center">
                                <Typography variant="h6">PUBLIC ADRESS</Typography>
                                <Typography variant="h6">0XDC25EF3F5B8A186998338A2ADA83795FBA27D695E</Typography>
                            </Grid>
                            <Grid container justify="space-between">
                                <Typography variant="h6">ACCOUNT TRANSACTIONS</Typography>
                                <Typography variant="h6">ACCOUNT BALANCE: 22.14334590087</Typography>
                            </Grid>
                            <TransactionTable/>
                        </Paper>
                    </Grid>
                </Hidden>
            </Grid>
        </Container>
    );
}