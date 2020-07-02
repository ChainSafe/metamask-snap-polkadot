import {Wallet} from "../interfaces";
import {Transaction} from "@nodefactory/metamask-polkadot-types";

export function saveTxToState(wallet: Wallet, tx: Transaction): void {
  const state = wallet.getPluginState();
  state.polkadot.transactions.push(tx);
  wallet.updatePluginState(state);
}

export function updateTxInState(wallet: Wallet, transaction: Transaction) {
  const state = wallet.getPluginState();
  const index = state.polkadot.transactions.findIndex(tx => tx.hash === transaction.hash);
  if (index >= 0) {
    state.polkadot.transactions[index] = transaction;
    wallet.updatePluginState(state);
  }
}