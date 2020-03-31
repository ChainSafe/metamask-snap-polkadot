import {Box, Button, Hidden} from "@material-ui/core";
import React, {useCallback, useContext} from "react";
import Alert from "@material-ui/lab/Alert";
import {MetamaskActions, MetaMaskContext} from "../../context/metamask";
import {installPolkadotSnap} from "../../services/metamask";
import {addDotAsset} from "../../services/asset";

export const MetaMaskConnector = () => {

    const [state, dispatch] = useContext(MetaMaskContext);

    const installSnap = useCallback(async () => {
       const isInitiated = await installPolkadotSnap();
       if(!isInitiated) {
           alert("Failed to install snap");
       } else {
           addDotAsset().catch(() => alert("Failed to add dot asset"));
           dispatch({type: MetamaskActions.SET_INSTALLED_STATUS, payload: true});
       }
    }, [dispatch]);

    return(
        <div>
            <Hidden xsUp={state.hasMetaMask}>
                <Alert severity="warning">Ensure that MetaMask is installed!</Alert>
                <Box mt={"1rem"} />
            </Hidden>
            <Button
                disabled={!state.hasMetaMask}
                onClick={installSnap}
                variant="contained"
                size={"large"}
                color="primary"
            >
                Connect to MetaMask
            </Button>
        </div>
    );

};