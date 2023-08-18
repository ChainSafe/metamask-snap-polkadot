import React from 'react';
import { Dashboard } from './containers/Dashboard/Dashboard';
import { MetaMaskContextProvider } from './context/metamask';

function App(): React.JSX.Element {
  return (
    <MetaMaskContextProvider>
      <Dashboard />
    </MetaMaskContextProvider>
  );
}

export default App;
