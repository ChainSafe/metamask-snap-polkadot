import {
  BlockInfo,
  PolkadotApi,
  SnapConfig,
  SnapRpcMethodRequest, Transaction,
  TxPayload
} from "@chainsafe/metamask-polkadot-types";
import {InjectedExtension} from "@polkadot/extension-inject/types";

export interface MetamaskSnapApi {
  getPublicKey(): Promise<string>;
  getBalance(): Promise<string>;
  exportSeed(): Promise<string>;
  getLatestBlock(): Promise<BlockInfo>;
  setConfiguration(configuration: SnapConfig): Promise<void>;
  getAllTransactions(): Promise<Transaction[]>;

  send(signature: string, txPayload: TxPayload): Promise<Transaction>;
  generateTransactionPayload(amount: string | number, to: string): Promise<TxPayload>;
  getEventApi(): Promise<PolkadotApi>;
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
      request: <T>(request: SnapRpcMethodRequest | {method: string; params?: any[]}) => Promise<T>;
      requestIndex: () => Promise<{getPluginApi: (origin: string) => Promise<PolkadotApi>}>;
    };
  }
}
