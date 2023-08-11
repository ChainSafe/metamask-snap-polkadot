import { MetamaskState } from '../../interfaces';
import { Transaction } from '@chainsafe/metamask-polkadot-types';

export async function getTransactions(): Promise<Transaction[]> {
  const state = (await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' }
  })) as MetamaskState;
  return state.transactions as unknown as Transaction[];
}
