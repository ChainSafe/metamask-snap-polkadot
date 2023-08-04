import { MetamaskState } from "../interfaces";
import deepmerge from "deepmerge";
import { getDefaultConfiguration } from "../configuration";
import { SnapConfig } from "@chainsafe/metamask-polkadot-types";
import { SnapsGlobalObject } from "@metamask/snaps-types";

export async function configure(
  snap: SnapsGlobalObject,
  networkName: string,
  overrides: unknown,
): Promise<SnapConfig> {
  const defaultConfig = getDefaultConfiguration(networkName) as SnapConfig;

  console.log("configure.ts defaultConfig", defaultConfig);
  const configuration = deepmerge(defaultConfig, overrides) as SnapConfig;
  console.log("configure.ts configuration", configuration);

  const state = (await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  })) as MetamaskState;

  console.log("configure.ts current state", state);

  state.config = JSON.stringify(configuration);

  await snap.request({
    method: "snap_manageState",
    params: {
      newState: state,
      operation: "update",
    },
  });

  return configuration;
}
