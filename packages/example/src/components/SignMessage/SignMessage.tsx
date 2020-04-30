import React, {useState} from "react";
import {Button, TextField, Card, CardContent, CardHeader, Grid, Box} from '@material-ui/core/';
import {getInjectedMetamaskExtension} from "../../services/metamask";
import {stringToHex} from "@polkadot/util/string";

export const SignMessage = () => {
    const [textFieldValue, setTextFieldValue] = useState<string>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextFieldValue(event.target.value);
      };

    const onSubmit = async () => {
        if(textFieldValue) {
            const provider = await getInjectedMetamaskExtension();
            if(provider && provider.signer && provider.signer.signRaw) {

                const messageAsHex = stringToHex(textFieldValue);
                const address = (await provider.accounts.get())[0].address

                const messageSignResponse = await provider.signer.signRaw({
                    data: messageAsHex,
                    address: address,
                    type: "bytes"
                });
                console.log("Message signed.");
                console.log(messageSignResponse);
            }
        }
    }

    return (
        <Card style={{height: "100%"}}>
            <CardHeader title="Sign custom message"/>
            <CardContent>
                <Grid container>
                    <TextField 
                    onChange={handleChange} 
                    value={textFieldValue} 
                    size="medium" 
                    fullWidth 
                    id="recipient" 
                    label="Message" 
                    variant="outlined" 
                    />
                </Grid>
                <Box m="0.5rem" />
                <Grid container justify="flex-end">
                    <Button onClick={onSubmit} color="secondary" variant="contained" size="large">Sign</Button>
                </Grid>
            </CardContent>
        </Card>
    );
}