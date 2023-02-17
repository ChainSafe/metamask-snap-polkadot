import '@polkadot/types-augment';
import { MetamaskPolkadotSnap } from "./snap";
import { SnapConfig } from "@chainsafe/metamask-polkadot-types";
import { hasMetaMask, isMetamaskSnapsSupported, isPolkadotSnapInstalled } from "./utils";

const defaultSnapOrigin = 'npm:@chainsafe/polkadot-snap';

export type SnapInstallationParamNames = "version" | string;

export * from './extension';

export async function enablePolkadotSnap(
  config: SnapConfig,
  snapOrigin?: string,
  snapInstallationParams: Record<SnapInstallationParamNames, unknown> = {}
): Promise<MetamaskPolkadotSnap> {

  const snapId = snapOrigin ?? defaultSnapOrigin;

  // check all conditions
  if (!hasMetaMask()) {
    throw new Error("Metamask is not installed");
  }
  if (!(await isMetamaskSnapsSupported())) {
    throw new Error("Current Metamask version doesn't support snaps");
  }
  if (!config.networkName) {
    throw new Error("Configuration must at least define network type");
  }

  const isInstalled = await isPolkadotSnapInstalled(snapId);
  console.log("isInstalled", isInstalled);
  if (!isInstalled) {
    // // enable snap
    await window.ethereum.request({
      method: "wallet_requestSnaps",
      params:
      {
        [`${snapId}`]: { ...snapInstallationParams },
      },
    });
  }

  // create snap describer
  const snap = new MetamaskPolkadotSnap(snapOrigin || defaultSnapOrigin, config);
  // set initial configuration
  await (await snap.getMetamaskSnapApi()).setConfiguration(config);
  // return snap object
  return snap;
}
