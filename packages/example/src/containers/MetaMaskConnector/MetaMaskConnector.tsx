import { Box, Button, IconButton, Snackbar } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { Fragment, useCallback, useContext, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import { MetamaskActions, MetaMaskContext } from '../../context/metamask';
import { initiatePolkdatodSnap, isPolkadotSnapInstalled } from '../../services/metamask';

export const MetaMaskConnector = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  useEffect(() => {
    (async () => {
      if (await isPolkadotSnapInstalled()) {
        console.log('== = == == = == = = isPolkadotSnapInstalled HOOK = = == = == = == = = == ');
        dispatch({
          payload: { isInstalled: true },
          type: MetamaskActions.SET_INSTALLED_STATUS
        });
      }
    })();
  }, [dispatch]);

  const installSnap = useCallback(async () => {
    const installResult = await initiatePolkdatodSnap();
    if (!installResult.isSnapInstalled) {
      // eslint-disable-next-line max-len
      dispatch({
        payload: {
          isInstalled: false,
          message: 'Please accept snap installation prompt'
        },
        type: MetamaskActions.SET_INSTALLED_STATUS
      });
    } else {
      // eslint-disable-next-line max-len
      dispatch({
        payload: { isInstalled: true, snap: installResult.snap },
        type: MetamaskActions.SET_INSTALLED_STATUS
      });
    }
  }, [dispatch]);

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
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
        style={{ marginTop: '1rem' }}
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
