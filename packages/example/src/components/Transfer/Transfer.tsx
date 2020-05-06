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
    Snackbar, Hidden
} from '@material-ui/core/';
import {getInjectedMetamaskExtension} from "../../services/metamask";
import {Alert} from "@material-ui/lab";
import {getPolkascanBlockUrl, getPolkascanTxUrl} from "../../services/polkascan";

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
    const [polkascanUrl, setPolkascanUrl] = useState("");

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

    const handleTransactionIncluded = useCallback((args) => {
        const txDetails = args[0];
        if (txDetails.txHash && txDetails.blockHash) {
            showAlert(
                "success",
                `Transaction ${txDetails.txHash} included in block`,
                getPolkascanBlockUrl(txDetails.blockHash, network)
            );
        }
    }, []);

    const handleTransactionFinalized = useCallback((args) => {
        const txDetails = args[0];
        if (txDetails.txHash && txDetails.blockHash) {
            showAlert(
                "success",
                `Transaction ${txDetails.txHash} finalized`,
                getPolkascanTxUrl(txDetails.txHash, network)
            );
        }
    }, []);

    const showAlert = (severity: AlertSeverity, message: string, polkasacanUrl?: string) => {
        setPolkascanUrl(polkasacanUrl ? polkasacanUrl : "");
        setSeverity(severity);
        setMessage(message);
        setAlert(true);
    };

    const onSubmit = useCallback(async () => {
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
    }, [amount, handleTransactionFinalized, handleTransactionIncluded, recipient]);

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
                <Snackbar
                    open={alert}
                    autoHideDuration={6000}
                    onClose={() => setAlert(false)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}>
                    <Alert severity={severity} onClose={() => setAlert(false)}>
                        {`${message} `}
                        <Hidden xsUp={polkascanUrl === ""}>
                            <a href={polkascanUrl}>See on Polkascan</a>
                        </Hidden>
                    </Alert>
                </Snackbar>
            </CardContent>
        </Card>
    );
};