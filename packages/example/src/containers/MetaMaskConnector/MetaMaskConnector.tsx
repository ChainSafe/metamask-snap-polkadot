import { Box, Button, Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import React, { useCallback, useContext, useEffect, Fragment } from "react";
import Alert from "@material-ui/lab/Alert";
import { MetamaskActions, MetaMaskContext } from "../../context/metamask";
import { installPolkadotSnap, isPolkadotSnapInstalled } from "../../services/metamask";

export const MetaMaskConnector = () => {

  const [state, dispatch] = useContext(MetaMaskContext);

  useEffect(() => {
    (async () => {
      if (await isPolkadotSnapInstalled()) {
        dispatch({ payload: { isInstalled: true }, type: MetamaskActions.SET_INSTALLED_STATUS });
      }
    })();
  }, [dispatch]);

  const installSnap = useCallback(async () => {
    const isInitiated = await installPolkadotSnap();
    if (!isInitiated) {
      // eslint-disable-next-line max-len
      dispatch({ payload: { isInstalled: false, message: "Please accept snap installation prompt" }, type: MetamaskActions.SET_INSTALLED_STATUS });
    } else {
      dispatch({ payload: { isInstalled: true }, type: MetamaskActions.SET_INSTALLED_STATUS });
    }
  }, [dispatch]);

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch({ payload: false, type: MetamaskActions.SET_INSTALLED_STATUS });
  };

  const shouldDisplaySnackbar = (): boolean => {
    if (!state.polkadotSnap.isInstalled && state.polkadotSnap.message) return true;
    else return false;
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
        open={shouldDisplaySnackbar()}
        autoHideDuration={6000}
        onClose={handleClose}
        message={state.polkadotSnap.message}
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      {state.hasMetaMask &&
                <Fragment>
                  <Alert severity="warning">Ensure that MetaMask is installed!</Alert>
                  <Box mt={"1rem"} />
                </Fragment>
      }
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