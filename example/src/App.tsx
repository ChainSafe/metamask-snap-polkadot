import React, {useCallback, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Metamask} from "./metamask";

function App() {

    const [metamask, setMetamask] = useState<Metamask>(new Metamask());

    const initMetamask = useCallback(async () => {
        const initialized = await metamask.init();
        if(initialized) {
            setMetamask(metamask);
        } else {
            alert("Failed to initialize plugin");
        }
    }, [metamask]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <button onClick={initMetamask}>Connect</button>
      </header>
    </div>
  );
}

export default App;
