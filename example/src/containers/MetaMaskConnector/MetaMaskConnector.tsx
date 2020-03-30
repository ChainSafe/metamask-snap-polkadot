import {Box, Button, Hidden, Snackbar, IconButton} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import React, {useCallback, useContext} from "react";
import Alert from "@material-ui/lab/Alert";
import {MetamaskActions, MetaMaskContext} from "../../context/metamask";
import {installPolkadotSnap} from "../../services/metamask";

export const MetaMaskConnector = () => {

    const [state, dispatch] = useContext(MetaMaskContext);

    const installSnap = useCallback(async () => {
       const isInitiated = await installPolkadotSnap();
       if(!isInitiated) {
          dispatch({type: MetamaskActions.HAS_INSTALL_FAILED, payload: true})
       } else {
           dispatch({type: MetamaskActions.SET_INSTALLED_STATUS, payload: true});

           let account: any[] = window.ethereum.on('accountsChanged', function (accounts: any) {
          });
          console.log(account);
          console.log(account[0]);

       }
    }, [dispatch]);

    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        dispatch({type: MetamaskActions.HAS_INSTALL_FAILED, payload: false})
      };

    return(
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={state.hasPolkadotInstallFailed}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Failed to install snap"
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