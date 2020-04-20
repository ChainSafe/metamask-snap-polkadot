import {MetamaskPolkadotRpcRequest} from "@nodefactory/metamask-polkadot-types";
import {SnapConfig} from "@nodefactory/metamask-polkadot-types";
import {BlockInfo} from "../../../packages/snap/src/rpc/substrate/getBlock";

export interface MetamaskSnapApi {
  getAccountAddress(pluginOrigin: string): Promise<string>;
  addPolkadotAsset(pluginOrigin: string): Promise<void>;
  getBalance(pluginOrigin: string): Promise<unknown>;
  getAddress(pluginOrigin: string): Promise<unknown>;
  exportSeed(pluginOrigin: string): Promise<unknown>;
  getLatestBlock(pluginOrigin: string): Promise<BlockInfo>;
  setConfiguration(pluginOrigin: string, configuration: SnapConfig): Promise<void>;
  getAllTransactions(pluginOrigin: string, address?: string): Promise<unknown>;
}

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