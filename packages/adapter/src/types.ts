import {MetamaskPolkadotRpcRequest} from "@nodefactory/metamask-polkadot-types";

export {};

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      send: (request: MetamaskRpcRequest) => Promise<unknown>;
      on: (eventName: unknown, callback: unknown) => unknown;
    };
  }
}

export interface WalletEnableRequest {
  method: "wallet_enable";
  params: object[];
}
export interface GetPluginsRequest {
  method: "wallet_getPlugins";
}
export interface SnapRpcMethodRequest {
  method: string;
  params: [MetamaskPolkadotRpcRequest];
}

export type MetamaskRpcRequest = WalletEnableRequest | GetPluginsRequest | SnapRpcMethodRequest;