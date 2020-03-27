import React, {useCallback, useState} from 'react';
import {Dashboard} from "./containers/Dashboard/Dashboard";

// import {Metamask} from "./metamask";

function App() {

    // const [metamask, setMetamask] = useState<Metamask>(new Metamask());

    // const initMetamask = useCallback(async () => {
    //     const initialized = await metamask.init();
    //     if(initialized) {
    //         setMetamask(metamask);
    //     } else {
    //         alert("Failed to initialize plugin");
    //     }
    // }, [metamask]);

  return (
    <Dashboard/>
  );
}

export default App;
