import { web3EnablePromise } from '@polkadot/extension-dapp';
import type { InjectedMetamaskExtension } from '@chainsafe/metamask-polkadot-adapter/src/types';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import { enablePolkadotSnap } from '@chainsafe/metamask-polkadot-adapter';
import type { MetamaskPolkadotSnap } from '@chainsafe/metamask-polkadot-adapter/build/snap';

export function hasMetaMask(): boolean {
  if (!window.ethereum) {
    return false;
  }
  return window.ethereum.isMetaMask;
}

export const defaultSnapId = 'local:http://localhost:8081';

export async function installPolkadotSnap(): Promise<boolean> {
  const snapId = process.env.REACT_APP_SNAP_ID ? process.env.REACT_APP_SNAP_ID : defaultSnapId;
  try {
    await enablePolkadotSnap({ networkName: 'westend' }, snapId);
    console.info('Snap installed!!');
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function isPolkadotSnapInstalled(): Promise<boolean> {
  return !!(await getInjectedMetamaskExtension());
}

export async function getInjectedMetamaskExtension(): Promise<InjectedMetamaskExtension | null> {
  const extensions = await web3EnablePromise;
  return getMetamaskExtension(extensions || []) || null;
}

function getMetamaskExtension(
  extensions: InjectedExtension[]
): InjectedMetamaskExtension | undefined {
  return extensions.find((item) => item.name === 'metamask-polkadot-snap') as unknown as
    | InjectedMetamaskExtension
    | undefined;
}

export interface SnapInitializationResponse {
  isSnapInstalled: boolean;
  snap?: MetamaskPolkadotSnap;
}

export async function initiatePolkadotSnap(): Promise<SnapInitializationResponse> {
  const snapId = process.env.REACT_APP_SNAP_ID ? process.env.REACT_APP_SNAP_ID : defaultSnapId;

  try {
    console.info('Attempting to connect to snap...');
    const metamaskPolkadotSnap = await enablePolkadotSnap({ networkName: 'westend' }, snapId);
    console.info('Snap installed!');
    return { isSnapInstalled: true, snap: metamaskPolkadotSnap };
  } catch (e) {
    console.error(e);
    return { isSnapInstalled: false };
  }
}
