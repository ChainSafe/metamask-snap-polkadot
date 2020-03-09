export type FMethodCallback = (
    originString: string,
    requestObject: { method: string; params: any }
) => Promise<any>;

export interface Wallet {
    registerRpcMessageHandler: (fn: FMethodCallback) => any;
    send(options: {method: string, params: any[]}): void;
}