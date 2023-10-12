import { Box, Button, IconButton, Snackbar } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { Fragment, useCallback, useContext, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import { MetamaskActions, MetaMaskContext } from '../../context/metamask';
import { initiatePolkadotSnap, isPolkadotSnapInstalled } from '../../services/metamask';

export const MetaMaskConnector = (): React.JSX.Element => {
  const [state, dispatch] = useContext(MetaMaskContext);

  useEffect(() => {
    void (async (): Promise<void> => {
      if (await isPolkadotSnapInstalled()) {
        dispatch({
          payload: { isInstalled: true },
          type: MetamaskActions.SET_INSTALLED_STATUS
        });
      }
    })();
  }, [dispatch]);

  const installSnap = useCallback(async (): Promise<void> => {
    const installResult = await initiatePolkadotSnap();
    if (!installResult.isSnapInstalled) {
      dispatch({
        payload: {
          isInstalled: false,
          message: 'Please accept snap installation prompt'
        },
        type: MetamaskActions.SET_INSTALLED_STATUS
      });
    } else {
      dispatch({
        payload: { isInstalled: true, snap: installResult.snap },
        type: MetamaskActions.SET_INSTALLED_STATUS
      });
    }
  }, [dispatch]);

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string): void => {
    if (reason === 'clickaway') return;

    dispatch({ payload: false, type: MetamaskActions.SET_INSTALLED_STATUS });
  };

  const shouldDisplaySnackbar = (): boolean => {
    return !!(!state.polkadotSnap.isInstalled && state.polkadotSnap.message);
  };

  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
      <Snackbar
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom'
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
      {state.hasMetaMask && (
        <Fragment>
          <Alert severity="warning">Ensure that MetaMask is installed!</Alert>
          <Box mt={'1rem'} />
        </Fragment>
      )}
      <Button
        style={{ marginTop: '0.5rem' }}
        disabled={!state.hasMetaMask}
        onClick={installSnap}
        variant="contained"
        size={'large'}
        color="primary"
      >
        Connect to MetaMask
      </Button>
    </Box>
  );
};
