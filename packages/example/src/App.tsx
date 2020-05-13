import React, {useEffect} from 'react';
import {Dashboard} from "./containers/Dashboard/Dashboard";
import {MetaMaskContextProvider} from "./context/metamask";
import {injectMetamaskPolkadotSnapProvider} from "@nodefactory/metamask-polkadot-adapter";

function App() {

    useEffect(() => {
        injectMetamaskPolkadotSnapProvider(
            "westend",
            undefined,
            "https://ipfs.infura.io/ipfs/QmPa7anrvkCHLmwiw8fKGRVQanGXfGqvfJprmxeCj24WiU/"
        );
    }, [])

  return (
      <MetaMaskContextProvider>
        <Dashboard/>
      </MetaMaskContextProvider>
  );
}

export default App;
