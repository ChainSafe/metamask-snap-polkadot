import { SnapsGlobalObject } from "@metamask/snaps-types";
import { MetamaskState } from "../interfaces";
import { Transaction } from "@chainsafe/metamask-polkadot-types";

export async function saveTxToState(snap: SnapsGlobalObject, tx: Transaction): Promise<void> {
  const state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  }) as MetamaskState;

  state.polkadot.transactions.push(tx);
  snap.request({
    method: 'snap_manageState',
    params: { newState: state, operation: 'update' },
  });
}

export async function updateTxInState(snap: SnapsGlobalObject, transaction: Transaction): Promise<void> {
  const state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  }) as MetamaskState;

  const index = state.polkadot.transactions.findIndex(tx => tx.hash === transaction.hash);
  if (index >= 0) {
    state.polkadot.transactions[index] = transaction;
    snap.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  }
}