export type FMethodCallback = (
  originString: string,
  requestObject: { method: string; params: unknown }
) => Promise<unknown>;

export interface Wallet {
  registerRpcMessageHandler: (fn: FMethodCallback) => unknown;
  send(options: {method: string; params: unknown[]}): void;
  getAppKey(): string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updatePluginState(state: any): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPluginState(): any;
  onUnlock(param: () => void): void;
}