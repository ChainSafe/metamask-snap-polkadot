import type { Transaction } from '@chainsafe/metamask-polkadot-types';
import type { MetamaskState } from '../../interfaces';

export async function getTransactions(): Promise<Transaction[]> {
  const state = (await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' }
  })) as MetamaskState;
  return state.transactions as unknown as Transaction[];
}
