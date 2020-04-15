import {KeyringPair$Json} from '@polkadot/keyring/types';
import {SnapConfig} from "./configuration/interfaces";
import {EventCallback, PolkadotEvent} from "./polkadot/events";

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
  registerApiRequestHandler: (origin: unknown) => unknown;
  registerRpcMessageHandler: (fn: FMethodCallback) => unknown;
  send(options: {method: string; params: unknown[]}): unknown;
  getAppKey(): Promise<string>;
  updatePluginState(state: MetamaskState): void;
  getPluginState(): MetamaskState;
}

export interface PolkadotApi {
  on(eventName: PolkadotEvent, callback: EventCallback): boolean;
  removeListener(eventName: PolkadotEvent, callback: EventCallback): boolean;
}

export interface Asset {
  balance: string|number;
  customViewUrl?: string;
  decimals?: number;
  identifier: string;
  image?: string;
  symbol: string;
}