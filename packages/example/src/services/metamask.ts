import { web3EnablePromise } from "@polkadot/extension-dapp";
import { InjectedMetamaskExtension } from "@chainsafe/metamask-polkadot-adapter/src/types";
import { SnapRpcMethodRequest } from "@chainsafe/metamask-polkadot-types";
import { InjectedExtension } from "@polkadot/extension-inject/types";
import { enablePolkadotSnap } from "@chainsafe/metamask-polkadot-adapter";
import { MetamaskPolkadotSnap } from "@chainsafe/metamask-polkadot-adapter/build/snap";

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      send: (request: SnapRpcMethodRequest | { method: string; params?: any[] }) => Promise<unknown>;
      on: (eventName: unknown, callback: unknown) => unknown;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      request: <T>(request: SnapRpcMethodRequest | { method: string; params?: any }) => Promise<T>;
    };
  }
}

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
    console.log("installing snap");

    await enablePolkadotSnap({ networkName: "westend" }, snapId, { version: "latest" });

    console.log("Snap installed!!");
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function isPolkadotSnapInstalled(): Promise<boolean> {
  return !! await getInjectedMetamaskExtension();
}

export async function getInjectedMetamaskExtension(): Promise<InjectedMetamaskExtension | null> {
  const extensions = await web3EnablePromise;
  return getMetamaskExtension(extensions || []) || null;
}

function getMetamaskExtension(extensions: InjectedExtension[]): InjectedMetamaskExtension | undefined {
  // eslint-disable-next-line max-len
  return extensions.find(item => item.name === "metamask-polkadot-snap") as unknown as InjectedMetamaskExtension | undefined;
}

export interface SnapInitializationResponse {
  isSnapInstalled: boolean;
  snap?: MetamaskPolkadotSnap;
}

export async function initiateFilecoinSnap(): Promise<SnapInitializationResponse> {
  const snapId = process.env.REACT_APP_SNAP_ID ? process.env.REACT_APP_SNAP_ID : defaultSnapId;
  try {
    console.log('Attempting to connect to snap...');
    const metamaskFilecoinSnap = await enablePolkadotSnap({ networkName: "westend" }, snapId, { version: "latest" });
    console.log('Snap installed!');
    return { isSnapInstalled: true, snap: metamaskFilecoinSnap };
  } catch (e) {
    console.error(e);
    return { isSnapInstalled: false };
  }
}