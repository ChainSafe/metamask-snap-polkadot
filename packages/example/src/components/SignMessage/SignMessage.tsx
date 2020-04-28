import React, {useState} from "react";
import {Button, TextField, Card, CardContent, CardHeader, Grid, Box} from '@material-ui/core/';
import {pluginOrigin, getInjectedMetamaskExtension} from "../../services/metamask";
import {u8aToHex} from "@polkadot/util/u8a";
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

                // const metamaskSnapApi = await provider.getMetamaskSnapApi();
                // const address = await metamaskSnapApi.getAddress(pluginOrigin);
                // const x = new TextEncoder().encode(textFieldValue);
                // const y = u8aToHex(x);
                // console.log(x);
                // console.log(y);
                const hexValue = stringToHex(textFieldValue);
                console.log(hexValue);

                const address = (await provider.accounts.get())[0].address

                const messageSignResponse = await provider.signer.signRaw({
                    data: hexValue,
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