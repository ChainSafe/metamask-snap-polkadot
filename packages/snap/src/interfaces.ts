import {MetamaskPolkadotRpcRequest, SnapConfig, Transaction} from "@chainsafe/metamask-polkadot-types";

export type FMethodCallback = (
  originString: string,
  requestObject: MetamaskPolkadotRpcRequest
) => Promise<unknown>;

export type MetamaskState = {
  polkadot: {
    config: SnapConfig;
    transactions: Transaction[];
  };
};

export const EmptyMetamaskState: () => MetamaskState = () => ({polkadot: {config: null, transactions: []}});

export interface Wallet {
  send(options: {method: string; params: unknown[]}): unknown;
  request(options: {method: string; params?: unknown}): unknown;
}

export interface Asset {
  balance: string|number;
  customViewUrl?: string;
  decimals?: number;
  identifier: string;
  image?: string;
  symbol: string;
}
