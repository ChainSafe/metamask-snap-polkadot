import { KeyringPair$Json } from '@polkadot/keyring/types';
import {Configuration} from "./configuration/configuration";

export type FMethodCallback = (
  originString: string,
  requestObject: RequestObject
) => Promise<unknown>;

export interface RequestObject { method: string; params: Record<string, unknown> };

export interface AccountState { keyring: KeyringPair$Json };

export interface MetamaskState {
  polkadot: {
    account: AccountState;
    configuration: Configuration;
  };
}

export const emptyMetamaskState: MetamaskState = {
  polkadot: {
    account: null,
    configuration: null
  }
};

export interface Wallet {
  registerRpcMessageHandler: (fn: FMethodCallback) => unknown;
  registerApiRequestHandler: (handler: (origin: string) => unknown) => unknown;
  send(options: {method: string; params: unknown[]}): unknown;
  getAppKey(): Promise<string>;
  updatePluginState(state: MetamaskState): void;
  getPluginState(): MetamaskState;
}

export interface Asset {
  balance: string;
  customViewUrl: string;
  decimals: number;
  identifier: string;
  image: string;
  symbol: string;
}