import { Dashboard } from "./containers/Dashboard/Dashboard";
import { MetaMaskContextProvider } from "./context/metamask";
//eslint-disable-next-line
import { injectMetamaskPolkadotSnapProvider } from "@chainsafe/metamask-polkadot-adapter";

function App() {

  return (
    <MetaMaskContextProvider>
      <Dashboard />
    </MetaMaskContextProvider>
  );
}

export default App;
