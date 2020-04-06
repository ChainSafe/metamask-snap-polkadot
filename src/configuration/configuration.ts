import {Wallet} from "../interfaces";
import {defaultConfiguration} from "../network/configurations";
import {getNetworkConfiguration, Network, NetworkConfiguration} from "../network/network";

export interface Configuration {
  network: Network | NetworkConfiguration;
}

export async function setConfiguration(wallet: Wallet, configuration: Configuration): Promise<NetworkConfiguration> {
  const state = wallet.getPluginState();
  state.polkadot.configuration = getNetworkConfiguration(configuration);
  wallet.updatePluginState(state);
  return state.polkadot.configuration;
}

export function getConfiguration(wallet: Wallet): NetworkConfiguration {
  const state = wallet.getPluginState();
  // set default configuration if conf. not set
  if (!state.polkadot.configuration) {
    state.polkadot.configuration = defaultConfiguration;
    wallet.updatePluginState(state);
  }
  return state.polkadot.configuration;
}