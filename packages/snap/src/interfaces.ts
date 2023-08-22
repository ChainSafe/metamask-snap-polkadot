import type { Json } from '@metamask/snaps-types';

export type MetamaskState = {
  config: Json;
  transactions: Json[];
};

export const EmptyMetamaskState: () => MetamaskState = () => ({
  config: null,
  transactions: []
});

export interface Wallet {
  send(options: { method: string; params: unknown[] }): unknown;
  request(options: { method: string; params?: unknown }): unknown;
}
