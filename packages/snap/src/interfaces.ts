import {MetamaskPolkadotRpcRequest, SnapConfig, Transaction} from "@chainsafe/metamask-polkadot-types";

export type FMethodCallback = (
  originString: string,
  requestObject: MetamaskPolkadotRpcRequest
) => Promise<unknown>;

export type MetamaskState = {
  polkadot: {
    config: SnapConfig;
    transactions: Transaction[];
  };
};

export const EmptyMetamaskState: () => MetamaskState = () => ({polkadot: {config: null, transactions: []}});

export interface Wallet {
  registerRpcMessageHandler: (fn: FMethodCallback) => unknown;
  send(options: {method: string; params: unknown[]}): unknown;
  getAppKey(): Promise<string>;
  updatePluginState(state: MetamaskState): void;
  getPluginState(): MetamaskState;
}

export interface Asset {
  balance: string|number;
  customViewUrl?: string;
  decimals?: number;
  identifier: string;
  image?: string;
  symbol: string;
}