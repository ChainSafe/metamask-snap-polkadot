import '@polkadot/types-augment';
import type { SnapConfig } from '@chainsafe/metamask-polkadot-types';
import { MetamaskPolkadotSnap } from './snap';
import { hasMetaMask, isMetamaskSnapsSupported, isPolkadotSnapInstalled } from './utils';

const defaultSnapOrigin = 'npm:@chainsafe/polkadot-snap';

export type SnapInstallationParamNames = string;

export * from './extension';

export async function enablePolkadotSnap(
  config: SnapConfig,
  snapOrigin?: string,
  snapInstallationParams: Record<SnapInstallationParamNames, unknown> = {}
): Promise<MetamaskPolkadotSnap> {
  const snapId = snapOrigin ?? defaultSnapOrigin;

  // check all conditions
  if (!hasMetaMask()) {
    throw new Error('Metamask is not installed');
  }
  if (!(await isMetamaskSnapsSupported())) {
    throw new Error("Current Metamask version doesn't support snaps");
  }
  if (!config.networkName) {
    throw new Error('Configuration must at least define network type');
  }

  const isInstalled = await isPolkadotSnapInstalled(snapId);
  console.info('isInstalled', isInstalled);

  if (!isInstalled) {
    // // enable snap
    await window.ethereum.request({
      method: 'wallet_requestSnaps',
      params: {
        [snapId]: { ...snapInstallationParams }
      }
    });
  }

  // create snap describer
  const snap = new MetamaskPolkadotSnap(snapOrigin || defaultSnapOrigin, config);
  // set initial configuration

  try {
    const snapApi = snap.getMetamaskSnapApi();
    console.info('snapApi', snapApi);
    await snapApi.setConfiguration(config);
  } catch (err) {
    console.error('Failed to set configuration', err);
  }

  return snap;
}
