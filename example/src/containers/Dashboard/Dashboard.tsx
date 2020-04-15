import React, {useContext, useEffect, useState} from "react";
import {Box, Card, CardContent, CardHeader, Container, Grid, Hidden, Typography} from '@material-ui/core/';
import {Transfer} from "../../components/Transfer/Transfer";
import {SignMessage} from "../../components/SignMessage/SignMessage";
import {TransactionTable} from "../../components/TransactionTable/TransactionTable";
import {Account} from "../../components/Account/Account";
import {MetaMaskConnector} from "../MetaMaskConnector/MetaMaskConnector";
import {MetaMaskContext} from "../../context/metamask";
import {LatestBlock} from "../../components/LatestBlock/LatestBlock";
import {getAddress, getBalance, getPublicKey} from "../../services/account";
import {BlockInfo} from "../../../../src/rpc/substrate/getBlock";
import {getLatestBlock} from "../../services/block";
import {addPolkadotAsset} from "../../services/asset";
import {setConfiguration} from "../../services/configuration";
import {getPolkadotApi} from "../../services/polkadot";
import {PolkadotApi, PolkadotEvent} from "../../interfaces";

export const Dashboard = () => {

    const [state] = useContext(MetaMaskContext);

    let [balance, setBalance] = useState("0");
    let [address, setAddress] = useState("");
    let [publicKey, setPublicKey] = useState("");
    let [latestBlock, setLatestBlock] = useState<BlockInfo>({hash: "", number: ""});

    let [api, setApi] = useState<PolkadotApi>(null);

    const balanceCallback = (...args: unknown[]) => {
        setBalance(args[0])
    };

    useEffect(() => {
        (async () => {
            let api = await getPolkadotApi();
            if (api) {
                api.on(PolkadotEvent.OnBalanceChange, balanceCallback)
            }
            setApi(api);
        })();
        return function cleanup() {
            api.removeListener(PolkadotEvent.OnBalanceChange, balanceCallback)
        }
    }, []);

    useEffect(() => {
        (async () => {
            if(state.polkadotSnap.isInstalled) {
                await setConfiguration({networkName: "kusama"});
                await addPolkadotAsset();
                setPublicKey(await getPublicKey());
                setAddress(await getAddress());
                setBalance(await getBalance());
                setLatestBlock(await getLatestBlock());
            }
        })();
    }, [state.polkadotSnap.isInstalled]);

    return (
        <Container maxWidth="lg" >
            <Grid direction="column" alignItems="center" justify="center" container spacing={3}>
                <Box m="2rem">
                    <Typography variant="h2">
                        Polkadot snap demo
                    </Typography>
                </Box>
                <Hidden xsUp={state.polkadotSnap.isInstalled}>
                    <MetaMaskConnector/>
                </Hidden>
                <Hidden xsUp={!state.polkadotSnap.isInstalled}>
                    <Grid container spacing={3} alignItems={"stretch"}>
                        <Grid item xs={12}>
                            <LatestBlock block={latestBlock}  />
                        </Grid>
                    </Grid>
                    <Box m="1rem"/>
                    <Grid container spacing={3} alignItems="stretch">
                        <Grid item xs={12}>
                            <Account address={address} balance={balance} publicKey={publicKey}/>
                        </Grid>
                    </Grid>
                    <Box m="1rem"/>
                    <Grid container spacing={3} alignItems="stretch">
                        <Grid item md={6} xs={12}>
                            <Transfer/>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <SignMessage/>
                        </Grid>
                    </Grid>
                    <Box m="1rem"/>
                    <Grid container spacing={3} alignItems={"stretch"}>
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
};