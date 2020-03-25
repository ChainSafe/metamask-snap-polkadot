import { KeyringPair$Json } from '@polkadot/keyring/types';

export type FMethodCallback = (
  originString: string,
  requestObject: RequestObject
) => Promise<unknown>;

export type RequestObject = { method: string; params: unknown };

export type AccountState = { keyring: KeyringPair$Json; seed: string };
export type MetamaskState = {polkadot: {account: AccountState}};

export interface Wallet {
  registerRpcMessageHandler: (fn: FMethodCallback) => unknown;
  send(options: {method: string; params: unknown[]}): unknown;
  getAppKey(): string;
  updatePluginState(state: MetamaskState): void;
  getPluginState(): MetamaskState;
}