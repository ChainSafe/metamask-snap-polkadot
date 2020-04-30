import React, {useContext, useEffect, useState} from "react";
import {Box, Card, CardContent, CardHeader, Container, Grid, Hidden, Typography, Select, MenuItem, InputLabel} from '@material-ui/core/';
import {Transfer} from "../../components/Transfer/Transfer";
import {SignMessage} from "../../components/SignMessage/SignMessage";
import {Transaction, TransactionTable} from "../../components/TransactionTable/TransactionTable";
import {Account} from "../../components/Account/Account";
import {MetaMaskConnector} from "../MetaMaskConnector/MetaMaskConnector";
import {MetaMaskContext} from "../../context/metamask";
import {LatestBlock} from "../../components/LatestBlock/LatestBlock";
import {getPublicKey} from "../../services/account";
import {getPolkadotApi} from "../../services/polkadot";
import {BlockInfo} from "@nodefactory/metamask-polkadot-types";
import {pluginOrigin, getInjectedMetamaskExtension} from "../../services/metamask";

export const Dashboard = () => {

    const [state] = useContext(MetaMaskContext);

    let [balance, setBalance] = useState("0");
    let [address, setAddress] = useState("");
    let [publicKey, setPublicKey] = useState("");
    let [latestBlock, setLatestBlock] = useState<BlockInfo>({hash: "", number: ""});
    let [transactions, setTransactions] = useState<Transaction[]>([]);

    const [network, setNetwork] = useState<"kusama" | "westend">("kusama");

    const handleNetworkChange = (event: React.ChangeEvent<{ value: any }>) => {
        const networkName = event.target.value as "kusama" | "westend";
        setNetwork(networkName);
      };

    useEffect(() => {
        (async () => {
            if(state.polkadotSnap.isInstalled) {
                const provider = await getInjectedMetamaskExtension();
                if(provider !== null) {
                    const metamaskSnapApi = await provider.getMetamaskSnapApi();
                    setAddress(await metamaskSnapApi.getAddress(pluginOrigin));
                    await metamaskSnapApi.setConfiguration(pluginOrigin, {networkName: network});
                    await metamaskSnapApi.addPolkadotAsset(pluginOrigin);
                    setPublicKey(await getPublicKey());
                    setBalance(await metamaskSnapApi.getBalance(pluginOrigin));
                    setLatestBlock(await metamaskSnapApi.getLatestBlock(pluginOrigin));
                    // @ts-ignore
                    setTransactions(await metamaskSnapApi.getAllTransactions(pluginOrigin, address))
                }
            }
        })();
    }, [state.polkadotSnap.isInstalled, network]);

    useEffect(() => {
        function handleBalanceChange(...args: unknown[]) {
            setBalance(String(args[0]))
        }

        if (state.polkadotSnap.isInstalled) {
            (async () => {
                const api = await getPolkadotApi();
                if(api) console.log(api.subscribeToBalance)
                if (api && api.subscribeToBalance) {
                    api.subscribeToBalance(handleBalanceChange);
                }
            })();
        }

        return function() {
            (async () => {
                const api = await getPolkadotApi();
                if(api) console.log(api.unsubscribeAllFromBalance)
                if (api && api.unsubscribeAllFromBalance) {
                    api.unsubscribeAllFromBalance();
                }
            })();
        }
    }, [state.polkadotSnap.isInstalled, network]);

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
                                    <TransactionTable txs={transactions}/>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Hidden>
            </Grid>
        </Container>
    );
};