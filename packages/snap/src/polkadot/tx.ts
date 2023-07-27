import { SnapsGlobalObject } from "@metamask/snaps-types";
import { MetamaskState } from "../interfaces";
import { Transaction } from "@chainsafe/metamask-polkadot-types";

export async function saveTxToState(
  snap: SnapsGlobalObject,
  tx: Transaction,
): Promise<void> {
  const state = (await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  }))  as MetamaskState;

  const transactionsArray = state.transactions as unknown as Transaction[];
  transactionsArray.push(tx);

  await snap.request({
    method: 'snap_manageState',
    params: { newState: state, operation: 'update' },
  });
}

export async function updateTxInState(
  snap: SnapsGlobalObject,
  transaction: Transaction,
): Promise<void> {
  const state = (await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  }))  as MetamaskState;

  const transactionsArray = state.transactions as unknown as Transaction[];

  const index = transactionsArray.findIndex(
    (tx) => tx.hash === transaction.hash,
  );

  if (index >= 0) {
    state.transactions[index] = JSON.stringify(transaction);
    await snap.request({
      method: "snap_manageState",
      params: { newState: state, operation: "update" },
    });
  }
}
