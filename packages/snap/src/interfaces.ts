import {
  MetamaskPolkadotRpcRequest,
} from "@chainsafe/metamask-polkadot-types";
import { Json } from "@metamask/snaps-types";

export type FMethodCallback = (
  originString: string,
  requestObject: MetamaskPolkadotRpcRequest,
) => Promise<unknown>;

export type MetamaskState = {
  config: Json;
  transactions: Json[];
};

export const EmptyMetamaskState: () => MetamaskState = () => ({
  config: null,
  transactions: [],
});

export interface Wallet {
  send(options: { method: string; params: unknown[] }): unknown;
  request(options: { method: string; params?: unknown }): unknown;
}

export interface Asset {
  balance: string | number;
  customViewUrl?: string;
  decimals?: number;
  identifier: string;
  image?: string;
  symbol: string;
}
