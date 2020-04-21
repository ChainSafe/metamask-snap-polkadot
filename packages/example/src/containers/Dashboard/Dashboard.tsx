import React, {useContext, useEffect, useState} from "react";
import {Box, Card, CardContent, CardHeader, Container, Grid, Hidden, Typography, Select, MenuItem, InputLabel} from '@material-ui/core/';
import {Transfer} from "../../components/Transfer/Transfer";
import {SignMessage} from "../../components/SignMessage/SignMessage";
import {TransactionTable} from "../../components/TransactionTable/TransactionTable";
import {Account} from "../../components/Account/Account";
import {MetaMaskConnector} from "../MetaMaskConnector/MetaMaskConnector";
import {MetaMaskContext} from "../../context/metamask";
import {LatestBlock} from "../../components/LatestBlock/LatestBlock";
// import {getAddress, getBalance, getPublicKey} from "../../services/account";
// import {getLatestBlock} from "../../services/block";
// import {addPolkadotAsset} from "../../services/asset";
// import {setConfiguration} from "../../services/configuration";
import {getPolkadotApi} from "../../services/polkadot";
import {BlockInfo} from "@nodefactory/metamask-polkadot-types";
import {web3Enable, web3Accounts, web3ListRpcProviders, web3FromAddress} from "@polkadot/extension-dapp";
import {InjectedExtension} from "@polkadot/extension-inject/types"
import {injectMetamaskPolkadotSnapProvider} from "@nodefactory/metamask-polkadot-adapter/";
import {MetamaskSnapApi} from "@nodefactory/metamask-polkadot-adapter/src/types";

export interface IPolkadotAdapter extends InjectedExtension {
    getMetamaskSnapApi: () => Promise<MetamaskSnapApi>;
    enableSnap: () => void;
    pluginOrigin: string;
    config: {"networkname" : string};
}


export const Dashboard = () => {

    const [state] = useContext(MetaMaskContext);

    let [balance, setBalance] = useState("0");
    let [address, setAddress] = useState("");
    let [publicKey, setPublicKey] = useState("");
    let [latestBlock, setLatestBlock] = useState<BlockInfo>({hash: "", number: ""});

    const [network, setNetwork] = useState<"kusama" | "westend">("kusama");

    const handleNetworkChange = (event: React.ChangeEvent<{ value: any }>) => {
        const networkName = event.target.value as "kusama" | "westend";
        setNetwork(networkName);
      };


    const testFunc = async (): Promise<IPolkadotAdapter | void> => {
        const allInjected = await web3Enable('my cool dapp');
        let MetamaskPolkadotSnap: IPolkadotAdapter;

        allInjected.forEach(extension => {
            console.log(extension.name);
            if(extension.name==="metamask-polkadot-snap") {
                console.log("ddaad")
                MetamaskPolkadotSnap = extension as IPolkadotAdapter;
                return MetamaskPolkadotSnap;
            } else console.log( "no polkadot adapter");
        });
        // const MetamaskPolkadotSnap = allInjected as unknown as IPolkadotAdapter;
        // MetamaskPolkadotSnap.getMetamaskSnapApi

        
        // return allInjected as unknown as IPolkadotAdapter;
    }

    injectMetamaskPolkadotSnapProvider(
        "kusama"
        );
    useEffect(() => {
        (async () => {
            const allInjected = await web3Enable('my cool dapp');
            console.log(allInjected);
            const test = await testFunc();
            console.log(test);
            // console.log(allInjected[0].g);
            // allInjected["metamask-js"].getMetamaskApi().configure()
            // const allAccounts = await web3Accounts();
            // console.log(allAccounts);
            // const injector = await web3FromAddress('EHkbSaapJPXsL1F83jpw6dWcN8Ar8PD1JDyKoTZVKCDF4J7');
            // console.log(injector);
            // const allProviders = web3ListRpcProviders('metamask-polkadot-snap');
            // console.log(allProviders);
            if(state.polkadotSnap.isInstalled) {
                // await setConfiguration({networkName: network});
                // await addPolkadotAsset();
                // setPublicKey(await getPublicKey());
                // setAddress(await getAddress());
                // setBalance(await getBalance());
                // setLatestBlock(await getLatestBlock());
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
                if (api) {
                    api.on("onBalanceChange", handleBalanceChange)
                }
            })();
        }

        return function() {
            (async () => {
                const api = await getPolkadotApi();
                if (api) {
                    api.removeAllListeners("onBalanceChange")
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