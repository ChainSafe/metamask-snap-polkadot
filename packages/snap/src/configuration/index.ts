import {MetamaskState, Wallet} from "../interfaces";
import {
  defaultConfiguration, kusamaConfiguration, localConfiguration,
  polkadotConfiguration, westendConfiguration, westmintConfiguration,
} from "./predefined";
import {SnapConfig} from "@chainsafe/metamask-polkadot-types";

export function getDefaultConfiguration(networkName: string): SnapConfig {
  switch (networkName) {
    case "kusama":
      console.log("Kusama configuration selected");
      return kusamaConfiguration;
    case "local":
      console.log("Local configuration selected");
      return localConfiguration;
    case "polkadot":
      console.log("Polkadot configuration selected");
      return polkadotConfiguration;
    case "westend":
      console.log("Westend configuration selected");
      return westendConfiguration;
    case "westmint":
      console.log("Westmint configuration selected");
      return westmintConfiguration;
    default:
      return defaultConfiguration;
  }
}

export async function getConfiguration(wallet: Wallet): Promise<SnapConfig> {
  const state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  }) as MetamaskState;
  if (!state || !state.polkadot.config) {
    return defaultConfiguration;
  }
  return state.polkadot.config;
}