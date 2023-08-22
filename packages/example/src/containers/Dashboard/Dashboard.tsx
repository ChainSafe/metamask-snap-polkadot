import React, { useCallback, useContext, useEffect, useState } from 'react';
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
import type { BlockInfo, SnapNetworks, Transaction } from '@chainsafe/metamask-polkadot-types';
import type { MetamaskSnapApi } from '@chainsafe/metamask-polkadot-adapter/src/types';
import { Transfer } from '../../components/Transfer/Transfer';
import { SignMessage } from '../../components/SignMessage/SignMessage';
import { TransactionTable } from '../../components/TransactionTable/TransactionTable';
import { Account } from '../../components/Account/Account';
import { MetaMaskConnector } from '../MetaMaskConnector/MetaMaskConnector';
import { MetaMaskContext } from '../../context/metamask';
import { LatestBlock } from '../../components/LatestBlock/LatestBlock';

export const Dashboard = (): React.JSX.Element => {
  const [state] = useContext(MetaMaskContext);
  const [balance, setBalance] = useState('0');
  const [address, setAddress] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [latestBlock, setLatestBlock] = useState<BlockInfo>({
    hash: '',
    number: ''
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [network, setNetwork] = useState<SnapNetworks>('westend');
  const [api, setApi] = useState<MetamaskSnapApi | null>(null);

  const handleNewTransaction = useCallback(async () => {
    if (!api) return;
    setTransactions(await api.getAllTransactions());
  }, [setTransactions]);

  const handleNetworkChange = async (
    event: React.ChangeEvent<{ value: unknown }>
  ): Promise<void> => {
    const networkName = event.target.value as SnapNetworks;
    if (networkName === network) return;
    if (!api) return;
    await api.setConfiguration({ networkName: networkName });
    setNetwork(networkName);
  };

  useEffect(() => {
    void (() => {
      if (state.polkadotSnap.isInstalled && state.polkadotSnap.snap) {
        const polkadotApi = state.polkadotSnap.snap.getMetamaskSnapApi();
        setApi(polkadotApi);
      }
    })();
  }, [state.polkadotSnap.isInstalled, state.polkadotSnap.snap]);

  useEffect(() => {
    void (async () => {
      if (api) {
        setAddress(await api.getAddress());
        setPublicKey(await api.getPublicKey());
        setBalance(await api.getBalance());
        setLatestBlock(await api.getLatestBlock());
        setTransactions(await api.getAllTransactions());
      }
    })();
  }, [api, network]);

  useEffect(() => {
    // periodically check balance
    const interval = setInterval(async () => {
      if (api) {
        const newBalance = await api.getBalance();
        setBalance(newBalance);
      }
    }, 60000); // every 60 seconds
    return () => clearInterval(interval);
  }, [api, balance, setBalance]);

  return (
    <Container maxWidth="lg">
      <Grid direction="column" alignItems="center" justifyContent="center" container spacing={3}>
        <Box style={{ margin: '2rem' }}>
          <Typography variant="h2">Polkadot snap demo</Typography>
        </Box>
        {!state.polkadotSnap.isInstalled ? (
          <MetaMaskConnector />
        ) : (
          <>
            <Box
              style={{ margin: '1rem' }}
              alignSelf="flex-start"
              justifySelf={'flex-start'}
              alignContent={'flex-start'}
            >
              <InputLabel>Network</InputLabel>
              <Select defaultValue={'westend'} onChange={handleNetworkChange}>
                <MenuItem value={'westend'}>Westend</MenuItem>
                <MenuItem value={'kusama'}>Kusama</MenuItem>
                <MenuItem value={'polkadot'}>Polkadot</MenuItem>
              </Select>
            </Box>
            <Grid container spacing={3} alignItems={'stretch'}>
              <Grid item xs={12}>
                <LatestBlock block={latestBlock} />
              </Grid>
            </Grid>
            <Box style={{ margin: '1rem' }} />
            <Grid container spacing={3} alignItems="stretch">
              <Grid item xs={12}>
                <Account
                  network={network}
                  address={address}
                  balance={balance}
                  publicKey={publicKey}
                />
              </Grid>
            </Grid>
            <Box style={{ margin: '1rem' }} />
            <Grid container spacing={3} alignItems="stretch">
              <Grid item md={6} xs={12}>
                <Transfer network={network} onNewTransferCallback={handleNewTransaction} />
              </Grid>
              <Grid item md={6} xs={12}>
                <SignMessage address={address} />
              </Grid>
            </Grid>
            <Box style={{ margin: '1rem' }} />
            <Grid container spacing={3} alignItems={'stretch'}>
              <Grid item xs={12}>
                <Card style={{ margin: '1rem 0' }}>
                  <CardHeader title="Account transactions" />
                  <CardContent>
                    <TransactionTable txs={transactions} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};
