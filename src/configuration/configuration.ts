import {Wallet} from "../interfaces";

export interface Configuration {
  rpcUrl: string;
  explorerUrl?: string;
  unit: {
    symbol: string;
    decimals: number;
    image?: string;
    customViewUrl?: string;
  };
  addressPrefix: number;
}

const defaultConfiguration: Configuration = {
  addressPrefix: 1,
  explorerUrl: "https://api-01.polkascan.io/kusama/api/v1/balances/transfer",
  rpcUrl: "wss://kusama-rpc.polkadot.io/",
  unit: {
    customViewUrl: "https://polkascan.io/pre/kusama/account/${address}",
    decimals: 0,
    image: 'https://img.techpowerup.org/200330/kusama.png',
    symbol: "KSM",
  }
};

export async function setConfiguration(wallet: Wallet, configuration: Configuration) {
  // Save configuration to metamask state
  const state = wallet.getPluginState();
  state.polkadot.configuration = configuration;
  wallet.updatePluginState(state);
}

export function getConfiguration(wallet: Wallet): Configuration {
  const state = wallet.getPluginState();
  // set default configuration if conf. not set
  if (!state.polkadot.configuration) {
    state.polkadot.configuration = defaultConfiguration;
    wallet.updatePluginState(state);
  }
  return state.polkadot.configuration;
}