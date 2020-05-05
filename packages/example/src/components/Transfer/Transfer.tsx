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
    Snackbar
} from '@material-ui/core/';
import {getInjectedMetamaskExtension} from "../../services/metamask";
import {Alert} from "@material-ui/lab";

interface ITransferProps {
    network: string
}

type AlertSeverity = "success" | "warning" | "info" | "error";

export const Transfer: React.FC<ITransferProps> = ({network}) => {
    const [recipient, setRecipient] = useState<string>("");
    const [amount, setAmount] = useState<string | number>("");

    const [alert, setAlert] = useState(false);
    const [severity, setSeverity] = useState("success" as AlertSeverity);
    const [message, setMessage] = useState("");

    const handleCurrency = (network: string): string => {
        switch(network) {
            case "kusama": return "KSM";
            case "westend":
                return "WND";
            default: return ""
        }
    };

    const handleRecipientChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRecipient(event.target.value);
    }, [setRecipient]);

    const handleAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
    }, [setAmount]);

    const handleTransactionIncluded = useCallback((arg) => {
        // TODO Expand messages inside alert (add polkascan url)
        showAlert("success", `Transaction ${arg.tx} included in block`);
    }, []);

    const handleTransactionFinalized = useCallback((arg) => {
        // TODO Expand messages inside alert (add polkascan url)
        showAlert("success", `Transaction ${arg.tx} finalized`)
    }, []);

    const showAlert = (severity: AlertSeverity, message: string) => {
        setAlert(true);
        setSeverity(severity);
        setMessage(message);
    };

    // TODO refactor to callback
    const onSubmit = async () => {
        const provider = await getInjectedMetamaskExtension();
        if(provider && provider.signer.signPayload) {
            if (amount && recipient) {
                const api = await provider.getMetamaskSnapApi();
                const txPayload = await api.generateTransactionPayload(amount, recipient);
                const signedTx = await provider.signer.signPayload(txPayload.payload);
                let txHash = await api.send(signedTx.signature, txPayload);
                // subscribe to transaction events
                const polkadotEventApi = await api.getEventApi();
                polkadotEventApi.subscribeToTxStatus(txHash, handleTransactionIncluded, handleTransactionFinalized)
            } else {
                showAlert("error", "Please fill recipient and amount fields.");
            }
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
                <Snackbar open={alert} autoHideDuration={6000} onClose={() => setAlert(false)}>
                    <Alert severity={severity} onClose={() => setAlert(false)}>
                        {message}
                    </Alert>
                </Snackbar>
            </CardContent>
        </Card>
    );
};