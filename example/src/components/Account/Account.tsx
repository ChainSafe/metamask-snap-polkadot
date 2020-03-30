import React, {useEffect, useState} from "react";
import {Button, Typography, Card, CardContent, CardHeader, Grid, Divider, Box} from '@material-ui/core/';
import {getAddress, getBalance, getPublicKey} from "../../services/snap";

export const Account = () => {

    let [balance, setBalance] = useState("");
    let [address, setAddress] = useState("");
    let [publicKey, setPublicKey] = useState("");

    useEffect(() => {
        // fetch public key
        (async function getPublicKeyWrapper() {
            setPublicKey(await getPublicKey());
        })();
        // fetch address
        (async function getAddressWrapper() {
            setAddress(await getAddress())
        })();
        // fetch balance
        (async function getBalanceWrapper() {
            setBalance(await getBalance());
        })();
    });

    return (
        <Card>
            <CardHeader title="Account details"/>
            <CardContent>
                <Grid container alignItems="center">
                    <Grid item md={6} xs={12}>
                        <Typography variant="h6">ADDRESS:</Typography>
                        <Typography variant="subtitle2">{address}</Typography>
                        <Divider light/>
                        <Box m={"0.5rem"}/>
                        <Typography variant="h6">PUBLIC KEY:</Typography>
                        <Typography variant="subtitle2">{publicKey}</Typography>
                        <Divider light/>
                        <Box m={"0.5rem"}/>
                        <Typography variant="h6">ACCOUNT BALANCE:</Typography>
                        <Typography variant="subtitle2">{balance}</Typography>
                    </Grid>
                </Grid>
                <Grid container item xs={12} justify="flex-end">
                    <Button color="secondary" variant={"contained"} onClick={getBalance}>Export private key</Button>
                </Grid>
            </CardContent>
        </Card>
    );
}