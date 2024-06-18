import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import { formatBalance } from '@polkadot/util/format/formatBalance';
import FileSaver from 'file-saver';
import { MetaMaskContext } from '../../context/metamask';
import { getCurrency } from '../../services/format';

export interface AccountProps {
  address: string;
  publicKey: string;
  balance: string;
  network: string;
}

export const Account = (props: AccountProps): React.JSX.Element => {
  const [state] = useContext(MetaMaskContext);
  const [exportJsonPassphrase, setExportJsonPassphrase] = useState<string>('');

  const handleExportSeed = async (): Promise<void> => {
    if (!state.polkadotSnap.snap) return;
    const api = state.polkadotSnap.snap.getMetamaskSnapApi();
    const privateKey = await api.exportSeed();
    alert(privateKey);
  };

  const handleExportAccount = async (): Promise<void> => {
    if (!state.polkadotSnap.snap) return;
    const api = state.polkadotSnap.snap.getMetamaskSnapApi();
    const privateKey = await api.exportAccount(exportJsonPassphrase);
    const blob = new Blob([privateKey]);
    FileSaver.saveAs(blob, 'account.json');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setExportJsonPassphrase(event.target.value);
  };

  return (
    <Card style={{ margin: '1rem 0' }}>
      <CardHeader title="Account details" />
      <CardContent>
        <Grid container alignItems="center">
          <Grid item md={6} xs={12}>
            <Typography variant="h6">ADDRESS:</Typography>
            <Typography variant="subtitle2">{props.address}</Typography>
            <Divider light />
            <Box style={{ margin: '0.5rem' }} />
            <Typography variant="h6">PUBLIC KEY:</Typography>
            <Typography variant="subtitle2">{props.publicKey}</Typography>
            <Divider light />
            <Box style={{ margin: '0.5rem' }} />
            <Typography variant="h6">ACCOUNT BALANCE:</Typography>
            <Typography variant="subtitle2">
              {formatBalance(props.balance, {
                decimals: 12,
                withSi: true,
                withUnit: getCurrency(props.network)
              })}
            </Typography>
          </Grid>
        </Grid>
        <Grid container item xs={12} justifyContent="center">
          <Grid item xs={4}>
            <Button color="secondary" variant={'contained'} onClick={handleExportSeed}>
              Export private key
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button color="secondary" variant={'contained'} onClick={handleExportAccount}>
              Export account as json
            </Button>
            <TextField
              onChange={handleChange}
              value={exportJsonPassphrase}
              size="small"
              id="recipient"
              label="optional json passphrase"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
