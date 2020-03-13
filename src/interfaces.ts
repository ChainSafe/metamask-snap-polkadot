export type FMethodCallback = (
  originString: string,
  requestObject: { method: string; params: unknown }
) => Promise<unknown>;

export type KeyPairState = { secretKey: Uint8Array; publicKey: Uint8Array };

export interface Wallet {
  registerRpcMessageHandler: (fn: FMethodCallback) => unknown;
  send(options: {method: string; params: unknown[]}): void;
  getAppKey(): string;
  updatePluginState(state: KeyPairState): void;
  getPluginState(): KeyPairState;
}