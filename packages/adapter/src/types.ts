import {PolkadotApi, SnapRpcMethodRequest} from "@nodefactory/metamask-polkadot-types";
import {SnapConfig} from "@nodefactory/metamask-polkadot-types";
import {BlockInfo} from "@nodefactory/metamask-polkadot-types";
import {InjectedExtension} from "@polkadot/extension-inject/types";

export interface MetamaskSnapApi {
  getAccountAddress(pluginOrigin: string): Promise<string>;
  addPolkadotAsset(pluginOrigin: string): Promise<void>;
  getBalance(pluginOrigin: string): Promise<string>;
  getAddress(pluginOrigin: string): Promise<string>;
  exportSeed(pluginOrigin: string): Promise<string>;
  getLatestBlock(pluginOrigin: string): Promise<BlockInfo>;
  setConfiguration(pluginOrigin: string, configuration: SnapConfig): Promise<void>;
  getAllTransactions(pluginOrigin: string, address?: string): Promise<unknown>;
  sendUnit(pluginOrigin: string, amount: string | number, to: string): Promise<string>;
}

export interface InjectedMetamaskExtension extends InjectedExtension {
  getMetamaskSnapApi: () => Promise<MetamaskSnapApi>;
}

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      send: (request: SnapRpcMethodRequest | {method: string; params?: any[]}) => Promise<unknown>;
      on: (eventName: unknown, callback: unknown) => unknown;
      requestIndex: () => Promise<{getPluginApi: (origin: string) => Promise<PolkadotApi>}>;
    };
  }
}
