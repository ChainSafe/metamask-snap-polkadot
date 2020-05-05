import React, {useCallback, useState} from "react";
import {Box, Button, Card, CardContent, CardHeader, Grid, TextField, InputAdornment} from '@material-ui/core/';
import {getInjectedMetamaskExtension} from "../../services/metamask";

interface ITransferProps {
    network: string
}

export const Transfer: React.FC<ITransferProps> = ({network}) => {
    const [recipient, setRecipient] = useState<string>("");
    const [amount, setAmount] = useState<string | number>("");

    const handleCurrency = (network: string): string => {
        switch(network) {
            case "kusama": return "KSM";
            case "westend": return "WST";
            default: return ""
        }
    };

    const handleRecipientChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRecipient(event.target.value);
    }, [setRecipient]);

    const handleAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
    }, [setAmount]);

    const onSubmit = async () => {
        const provider = await getInjectedMetamaskExtension();
        if(provider && provider.signer.signPayload) {
            const api = await provider.getMetamaskSnapApi();
            const txPayload = await api.generateTransactionPayload(amount, recipient);
            const signedTx = await provider.signer.signPayload(txPayload.payload);
            let txHash = await api.send(signedTx.signature, txPayload);
        }
    };

    return (
        <Card>
            <CardContent>
                <CardHeader title="Transfer"/>
                <Grid container alignItems="center" justify="space-between">
                    <Grid item xs={12}>
                        <TextField 
                        
                        onChange={handleRecipientChange} size="medium" fullWidth id="recipient" label="Recipient" variant="outlined" />
                        <Box m="0.5rem"/>
                        <TextField 
                        InputProps={{startAdornment: <InputAdornment position="start">{handleCurrency(network)}</InputAdornment>}}
                        onChange={handleAmountChange} size="medium" fullWidth id="recipient" label="Amount" variant="outlined" />
                    </Grid>
                </Grid>
                <Box m="0.5rem"/>
                <Grid container item xs={12} justify="flex-end">
                    <Button onClick={onSubmit} color="secondary" variant="contained" size="large">SEND</Button>
                </Grid>
            </CardContent>
        </Card>
    );
}