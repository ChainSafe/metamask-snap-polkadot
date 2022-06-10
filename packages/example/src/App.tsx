import { useEffect } from 'react';
import { Dashboard } from "./containers/Dashboard/Dashboard";
import { MetaMaskContextProvider } from "./context/metamask";
//eslint-disable-next-line
import { injectMetamaskPolkadotSnapProvider } from "@chainsafe/metamask-polkadot-adapter";

function App() {

  useEffect(() => {
    injectMetamaskPolkadotSnapProvider(
      "westend",
      undefined,
      "http://localhost:8081/package.json"
    );
  }, []);

  return (
    <MetaMaskContextProvider>
      <Dashboard />
    </MetaMaskContextProvider>
  );
}

export default App;
