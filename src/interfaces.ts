import { KeyringPair$Json } from '@polkadot/keyring/types';
import {SnapConfig} from "./configuration/interfaces";
import {defaultConfiguration} from "./configuration/predefined";

export type FMethodCallback = (
  originString: string,
  requestObject: RequestObject
) => Promise<unknown>;

export type RequestObject = { method: string; params: Record<string, unknown> };

export type AccountState = { keyring: KeyringPair$Json };
export type MetamaskState = {
  polkadot: {
    config: SnapConfig;
    account: AccountState;
  };
};

export const EmptyMetamaskState: () => MetamaskState = () => ({polkadot: {account: null, config: null}});

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