import { SnapsGlobalObject } from "@metamask/snaps-types";
import {MetamaskState} from "../interfaces";
import {
  defaultConfiguration,
  kusamaConfiguration,
  polkadotConfiguration,
  westendConfiguration,
} from "./predefined";
import {SnapConfig} from "@chainsafe/metamask-polkadot-types";

export function getDefaultConfiguration(networkName: string): SnapConfig {
  switch (networkName) {
    case "polkadot":
      console.log("Polkadot configuration selected");
      return polkadotConfiguration;
    case "kusama":
      console.log("Kusama configuration selected");
      return kusamaConfiguration;
    case "westend":
      console.log("Westend configuration selected");
      return westendConfiguration;
    default:
      return defaultConfiguration;
  }
}

export async function getConfiguration(snap: SnapsGlobalObject): Promise<SnapConfig> {
  const state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  }) as MetamaskState;
  if (!state || !state.polkadot.config) {
    return defaultConfiguration;
  }
  return state.polkadot.config;
}