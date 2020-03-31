import {Box, Button, Hidden, Snackbar, IconButton} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
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
          dispatch({type: MetamaskActions.SET_INSTALLED_STATUS, payload: {isInstalled: false, message: "Please accept snap installation prompt"}})
       } else {
          dispatch({type: MetamaskActions.SET_INSTALLED_STATUS, payload: {isInstalled: true}});

        //   window.ethereum.on('accountsChanged', function (accounts: string[]) {
        //   console.log(accounts[0]);
        // })
        
        // let account = window.ethereum.on('accountsChanged', function (accounts: string[]) {
        //   console.log(accounts[0]);
        // })
        // console.log(account);
        // // console.log(account[0]);

           const dotAssetAdded = await addDotAsset();
           if (!dotAssetAdded) {
               alert("Failed to add dot asset to metamask");
           }
           dispatch({type: MetamaskActions.SET_INSTALLED_STATUS, payload: true});
       }
    }, [dispatch]);

    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        dispatch({type: MetamaskActions.SET_INSTALLED_STATUS, payload: false})
      };
    
    const handleSnackbar = (): boolean => {
      if (!state.isPolkadotSnapInstalled.isInstalled && state.isPolkadotSnapInstalled.message) return true;
      else return false;
    }

    return(
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={handleSnackbar()}
                autoHideDuration={6000}
                onClose={handleClose}
                message={state.isPolkadotSnapInstalled.message}
                action={
                    <React.Fragment>
                      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </React.Fragment>
                  }
            />
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