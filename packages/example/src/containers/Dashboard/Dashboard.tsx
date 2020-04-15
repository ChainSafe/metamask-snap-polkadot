import React, {useContext, useEffect, useState} from "react";
import {Box, Card, CardContent, CardHeader, Container, Grid, Hidden, Typography, Select, MenuItem, InputLabel} from '@material-ui/core/';
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
import {PolkadotEvent} from "../../interfaces";
import {ApiPromise} from "@polkadot/api";

export const Dashboard = () => {

    const [state] = useContext(MetaMaskContext);

    let [balance, setBalance] = useState("0");
    let [address, setAddress] = useState("");
    let [publicKey, setPublicKey] = useState("");
    let [latestBlock, setLatestBlock] = useState<BlockInfo>({hash: "", number: ""});

    let [api, setApi] = useState<ApiPromise>(null);

    const [network, setNetwork] = useState<"kusama" | "westend">("kusama");

    const handleNetworkChange = (event: React.ChangeEvent<{ value: any }>) => {
        const networkName = event.target.value as "kusama" | "westend";
        setNetwork(networkName);
      };

    const balanceCallback = (...args: unknown[]) => {
    const balanceCallback = useCallback((...args: unknown[]) => {
        console.log(`Callback called: ${args}`);
        setBalance(args[0])
    }, [setBalance]);

    useEffect(() => {
        (async () => {
            console.log("USE EFFECT CALLED: SETUP");
            if(state.polkadotSnap.isInstalled) {
                await setConfiguration({networkName: network});
                await addPolkadotAsset();
                setPublicKey(await getPublicKey());
                setAddress(await getAddress());
                const b = await getBalance();
                console.log(`Balance: ${b}`);
                setBalance(b);
                setLatestBlock(await getLatestBlock());

                const a = await getPolkadotApi();
                console.log(`Api: ${a}`);
                setApi(a);
            }
        })();
    }, [state.polkadotSnap.isInstalled]);

    useEffect(() => {
        console.log("USE EFFECT CALLED: POLKADOT");
        if (api) {
            console.log("Calling API to register listener");
            console.log(balanceCallback);
            api.on(PolkadotEvent.OnBalanceChange, balanceCallback)
        }

        return function cleanup() {
            console.log("CLEANUP CALLED: POLKADOT");
            console.log(api);
            console.log(balance);
            console.log(address);
            if (api) {
                console.log("Calling API to remove listener");
                console.log(balanceCallback);
                api.removeListener(PolkadotEvent.OnBalanceChange, balanceCallback)
            }
        }
    }, [state.polkadotSnap.isInstalled, balanceCallback, network]);

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
                    <Box m="1rem" alignSelf="baseline">
                        <InputLabel>Network</InputLabel>
                        <Select
                            defaultValue={"kusama"}
                            onChange={handleNetworkChange}
                        >
                            <MenuItem value={"kusama"}>Kusama</MenuItem>
                            <MenuItem value={"westend"}>Westend</MenuItem>
                        </Select>
                    </Box>
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