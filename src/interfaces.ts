import { KeyringPair$Json } from '@polkadot/keyring/types';
import {NetworkConfiguration} from "./network/interfaces";

export type FMethodCallback = (
  originString: string,
  requestObject: RequestObject
) => Promise<unknown>;

export type RequestObject = { method: string; params: Record<string, unknown> };

export type AccountState = { keyring: KeyringPair$Json };
export type MetamaskState = {
  polkadot: {
    account: AccountState;
    configuration: NetworkConfiguration;
  };
};

export const emptyMetamaskState: MetamaskState = {
  polkadot: {
    account: null,
    configuration: null
  }
};

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