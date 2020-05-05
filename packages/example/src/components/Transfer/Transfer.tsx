import React, {useCallback, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid,
    TextField,
    InputAdornment,
    Hidden,
    Badge,
    Chip
} from '@material-ui/core/';
import {getInjectedMetamaskExtension} from "../../services/metamask";

interface ITransferProps {
    network: string
}

export const Transfer: React.FC<ITransferProps> = ({network}) => {
    const [recipient, setRecipient] = useState<string>("");
    const [amount, setAmount] = useState<string | number>("");
    const [included, setIncluded] = useState(true);
    const [finalized, setFinalized] = useState(true);

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

    const handleTransactionIncluded = useCallback(() => {
        setIncluded(true);
    }, [setIncluded]);

    const handleTransactionFinalized = useCallback(() => {
        setFinalized(true);
    }, [setFinalized]);

    const onSubmit = async () => {
        const provider = await getInjectedMetamaskExtension();
        if(provider && provider.signer.signPayload) {
            const api = await provider.getMetamaskSnapApi();
            const txPayload = await api.generateTransactionPayload(amount, recipient);
            const signedTx = await provider.signer.signPayload(txPayload.payload);
            let txHash = await api.send(signedTx.signature, txPayload);
            // subscribe to transaction events
            const polkadotEventApi = await api.getEventApi();
            polkadotEventApi.subscribeToTxStatus(txHash, handleTransactionIncluded, handleTransactionFinalized)
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
                <Grid container spacing={1}>
                    <Hidden xsUp={!included}>
                        <Grid item>
                            <Chip color={"primary"} label="Included" />
                        </Grid>
                    </Hidden>
                    <Hidden xsUp={!finalized}>
                        <Grid item>
                            <Chip color={"primary"} label="Finalized" />
                        </Grid>
                    </Hidden>
                </Grid>
            </CardContent>
        </Card>
    );
}