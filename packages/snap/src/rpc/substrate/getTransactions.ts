import {Wallet} from "../../interfaces";
import {Transaction} from "@nodefactory/metamask-polkadot-types";

export async function getTransactions(wallet: Wallet): Promise<Transaction[]> {
  // return wallet.getPluginState().polkadot.transactions
  //     .filter(value => value.sent)
  //     .map(value => value.transaction);

  return wallet.getPluginState().polkadot.transactions
    .map(value => value.transaction);
}

