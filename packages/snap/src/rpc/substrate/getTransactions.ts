import {MetamaskState, Wallet} from "../../interfaces";
import {Transaction} from "@chainsafe/metamask-polkadot-types";

export async function getTransactions(wallet: Wallet): Promise<Transaction[]> {
  const state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  }) as MetamaskState;
  return state.polkadot.transactions;
}

