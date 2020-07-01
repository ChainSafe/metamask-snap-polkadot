import {Wallet} from "../interfaces";
import {Transaction} from "@nodefactory/metamask-polkadot-types";

export function saveTxToState(wallet: Wallet, tx: Transaction, sent?: boolean): void {
  const state = wallet.getPluginState();
  if (sent) {
    const index = state.polkadot.transactions.findIndex(value => value.transaction.hash === tx.hash);
    const savedTx = state.polkadot.transactions[index];
    savedTx.sent = true;
    state.polkadot.transactions[index] = savedTx;
  } else {
    state.polkadot.transactions.push({sent: false, transaction: tx});
  }
  wallet.updatePluginState(state);
}