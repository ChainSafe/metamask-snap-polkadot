import {Network, NetworkConfiguration} from "../network/interfaces";
import {Wallet} from "../interfaces";
import {defaultConfiguration, getNetworkConfiguration} from "../network";

export interface Configuration {
  network: Network | NetworkConfiguration;
}

export async function setConfiguration(wallet: Wallet, configuration: Configuration): Promise<NetworkConfiguration> {
  const state = wallet.getPluginState();
  state.polkadot.network = getNetworkConfiguration(configuration);
  wallet.updatePluginState(state);
  return state.polkadot.network;
}

export function getConfiguration(wallet: Wallet): NetworkConfiguration {
  const state = wallet.getPluginState();
  // set default configuration if conf. not set
  if (!state.polkadot.network) {
    state.polkadot.network = defaultConfiguration;
    wallet.updatePluginState(state);
  }
  return state.polkadot.network;
}