import {SnapConfig} from "./interfaces";
import {SnapConfigState, Wallet} from "../interfaces";
import {kusamaConfiguration, westendConfiguration} from "./predefined";

function getSnapConfigState(configuration: SnapConfig): SnapConfigState {
  switch (configuration.network) {
    case "kusama":
      console.log("Kusama configuration selected");
      return kusamaConfiguration;
    case "westend":
      console.log("Westend configuration selected");
      return westendConfiguration;
    default:
      // custom configuration
      if (configuration.unit) {
        console.log("Custom configuration selected");
        return {network: configuration.network, unit: configuration.unit};
      } else {
        throw new Error(""); // todo invalid config
      }
  }
}

export function setConfiguration(wallet: Wallet, configuration: SnapConfig): SnapConfigState {
  const state = wallet.getPluginState();
  state.polkadot.config = getSnapConfigState(configuration);
  wallet.updatePluginState(state);
  return state.polkadot.config;
}

export function getConfiguration(wallet: Wallet): SnapConfigState | null {
  const state = wallet.getPluginState();
  return state.polkadot.config;
}