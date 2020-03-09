export type FMethodCallback = (
  originString: string,
  requestObject: { method: string; params: unknown }
) => Promise<unknown>;

export interface Wallet {
  registerRpcMessageHandler: (fn: FMethodCallback) => unknown;
  send(options: {method: string; params: unknown[]}): void;
}