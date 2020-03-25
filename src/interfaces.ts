export type FMethodCallback = (
  originString: string,
  requestObject: RequestObject
) => Promise<unknown>;

export type RequestObject = { method: string; params: unknown };

export type KeyPairState = { secretKey: Uint8Array; publicKey: Uint8Array };
export type MetamaskState = {polkadot: {account: KeyPairState}};

export interface Wallet {
  registerRpcMessageHandler: (fn: FMethodCallback) => unknown;
  send(options: {method: string; params: unknown[]}): unknown;
  getAppKey(): string;
  updatePluginState(state: MetamaskState): void;
  getPluginState(): MetamaskState;
}