import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@material-ui/core';
import { Transfer } from "../../components/Transfer/Transfer";
import { SignMessage } from "../../components/SignMessage/SignMessage";
import { TransactionTable } from "../../components/TransactionTable/TransactionTable";
import { Account } from "../../components/Account/Account";
import { MetaMaskConnector } from "../MetaMaskConnector/MetaMaskConnector";
import { MetaMaskContext } from "../../context/metamask";
import { LatestBlock } from "../../components/LatestBlock/LatestBlock";
import { BlockInfo, SnapNetworks, Transaction } from "@chainsafe/metamask-polkadot-types";
import { MetamaskSnapApi } from "@chainsafe/metamask-polkadot-adapter/build/types";

export const Dashboard = () => {
  const [state] = useContext(MetaMaskContext);

  const [balance, setBalance] = useState("0");
  const [address, setAddress] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [latestBlock, setLatestBlock] = useState<BlockInfo>({ hash: "", number: "" });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [network, setNetwork] = useState<SnapNetworks>("westend");

  const [api, setApi] = useState<MetamaskSnapApi | null>(null);

  const handleNewTransaction = useCallback(async () => {
    if (!api) return;
    setTransactions((await api.getAllTransactions()));
  }, [setTransactions]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNetworkChange = async (event: React.ChangeEvent<{ value: any }>) => {
    const networkName = event.target.value as SnapNetworks;
    if (networkName === network) return;
    if (!api) return;
    await api.setConfiguration({ networkName: networkName });
    setNetwork(networkName);
  };

  useEffect(() => {
    (async () => {
      if (state.polkadotSnap.isInstalled && state.polkadotSnap.snap) {
        const polkadotApi = await state.polkadotSnap.snap.getMetamaskSnapApi();
        setApi(polkadotApi);
      }
    })();
  }, [state.polkadotSnap.isInstalled, state.polkadotSnap.snap]);

  useEffect(() => {
    (async () => {
      if (api) {
        setAddress(await api.getAddress());
        setPublicKey(await api.getPublicKey());
        setBalance(await api.getBalance());
        setLatestBlock(await api.getLatestBlock());
        setTransactions((await api.getAllTransactions()));
      }
    })();
  }, [api, network]);

  useEffect( () => {
    // periodically check balance
    const interval = setInterval(async () => {
      if (api) {
        const newBalance = await api.getBalance();
        setBalance(newBalance);
      }
    }, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, [api, balance, setBalance]);

  return (
    <Container maxWidth="lg">
      <Grid direction="column" alignItems="center" justify="center" container spacing={3}>
        <Box m="2rem">
          <Typography variant="h2">
            Polkadot snap demo
          </Typography>
        </Box>
        {
          !state.polkadotSnap.isInstalled && <MetaMaskConnector />
        }
        {
          state.polkadotSnap.isInstalled && <>
            <Box m="1rem" alignSelf="baseline">
              <InputLabel>Network</InputLabel>
              <Select
                defaultValue={"westend"}
                onChange={handleNetworkChange}
              >
                <MenuItem value={"westend"}>Westend</MenuItem>
                <MenuItem value={"westmint"}>Westmint</MenuItem>
                <MenuItem value={"kusama"}>Kusama</MenuItem>
                <MenuItem value={"polkadot"}>Polkadot</MenuItem>
              </Select>
            </Box>
            <Grid container spacing={3} alignItems={"stretch"}>
              <Grid item xs={12}>
                <LatestBlock block={latestBlock} />
              </Grid>
            </Grid>
            <Box m="1rem" />
            <Grid container spacing={3} alignItems="stretch">
              <Grid item xs={12}>
                <Account network={network} address={address} balance={balance} publicKey={publicKey} />
              </Grid>
            </Grid>
            <Box m="1rem" />
            <Grid container spacing={3} alignItems="stretch">
              <Grid item md={6} xs={12}>
                <Transfer network={network} onNewTransferCallback={handleNewTransaction} />
              </Grid>
              <Grid item md={6} xs={12}>
                <SignMessage address={address} />
              </Grid>
            </Grid>
            <Box m="1rem" />
            <Grid container spacing={3} alignItems={"stretch"}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Account transactions" />
                  <CardContent>
                    <TransactionTable txs={transactions} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        }
      </Grid>
    </Container>
  );
};