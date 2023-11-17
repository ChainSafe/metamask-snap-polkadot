import '@polkadot/types-augment';
import type { SnapConfig } from '@subspace/metamask-subspace-types';
import { MetamaskSubspaceSnap } from './snap';
import { hasMetaMask, isMetamaskSnapsSupported, isSubspaceSnapInstalled } from './utils';

const defaultSnapOrigin = 'npm:@subspace/subspace-snap';

export type SnapInstallationParamNames = string;

export * from './extension';
export { hasMetaMask, isSubspaceSnapInstalled, isMetamaskSnapsSupported } from './utils';

export async function enableSubspaceSnap(
  config: SnapConfig = { networkName: 'gemini-3g' },
  snapOrigin?: string,
  snapInstallationParams: Record<SnapInstallationParamNames, unknown> = {}
): Promise<MetamaskSubspaceSnap> {
  const snapId = snapOrigin ?? defaultSnapOrigin;

  // check all conditions
  if (!hasMetaMask()) {
    throw new Error('Metamask is not installed');
  }
  if (!(await isMetamaskSnapsSupported())) {
    throw new Error("Current Metamask version doesn't support snaps");
  }
  if (!config.networkName) {
    config.networkName = 'gemini-3g';
  }

  const isInstalled = await isSubspaceSnapInstalled(snapId);
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
  const snap = new MetamaskSubspaceSnap(snapOrigin || defaultSnapOrigin, config);
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
