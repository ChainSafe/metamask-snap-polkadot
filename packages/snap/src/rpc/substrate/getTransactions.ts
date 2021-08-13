import {Wallet} from "../../interfaces";
import {Transaction} from "@chainsafe/metamask-polkadot-types";

export async function getTransactions(wallet: Wallet): Promise<Transaction[]> {
  return wallet.getPluginState().polkadot.transactions;
}

