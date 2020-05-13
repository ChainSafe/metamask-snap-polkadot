import React, {useEffect} from 'react';
import {Dashboard} from "./containers/Dashboard/Dashboard";
import {MetaMaskContextProvider} from "./context/metamask";
import {injectMetamaskPolkadotSnapProvider} from "@nodefactory/metamask-polkadot-adapter";

function App() {

    useEffect(() => {
        injectMetamaskPolkadotSnapProvider(
            "westend",
            undefined,
            "http://localhost:8081/dist/bundle.js"
        );
    }, [])

  return (
      <MetaMaskContextProvider>
        <Dashboard/>
      </MetaMaskContextProvider>
  );
}

export default App;
