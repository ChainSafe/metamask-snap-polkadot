import {MetamaskState, Wallet} from "../interfaces";
import {Transaction} from "@chainsafe/metamask-polkadot-types";

export async function saveTxToState(wallet: Wallet, tx: Transaction): Promise<void> {
  const state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  }) as MetamaskState;

  state.polkadot.transactions.push(tx);
  wallet.request({
    method: 'snap_manageState',
    params: ['update', state],
  });
}

export async function updateTxInState(wallet: Wallet, transaction: Transaction): Promise<void> {
  const state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  }) as MetamaskState;

  const index = state.polkadot.transactions.findIndex(tx => tx.hash === transaction.hash);
  if (index >= 0) {
    state.polkadot.transactions[index] = transaction;
    wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  }
}