import {MetamaskPolkadotRpcRequest} from "@nodefactory/metamask-polkadot-types";
import {SnapConfig} from "@nodefactory/metamask-polkadot-types";
import {BlockInfo} from "@nodefactory/metamask-polkadot-types";
import {InjectedExtension} from "@polkadot/extension-inject/types"

export interface MetamaskSnapApi {
  getAccountAddress(pluginOrigin: string): Promise<string>;
  addPolkadotAsset(pluginOrigin: string): Promise<void>;
  getBalance(pluginOrigin: string): Promise<string>;
  getAddress(pluginOrigin: string): Promise<string>;
  exportSeed(pluginOrigin: string): Promise<string>;
  getLatestBlock(pluginOrigin: string): Promise<BlockInfo>;
  setConfiguration(pluginOrigin: string, configuration: SnapConfig): Promise<void>;
  getAllTransactions(pluginOrigin: string, address?: string): Promise<unknown>;
}

export interface InjectedMetamaskExtension extends InjectedExtension {
  getMetamaskSnapApi:() => Promise<MetamaskSnapApi>;
}

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      send: (request: SnapRpcMethodRequest | {method: string; params?: any[]}) => Promise<unknown>;
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