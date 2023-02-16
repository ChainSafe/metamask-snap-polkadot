import { SnapsGlobalObject } from "@metamask/snaps-types";
import {MetamaskState} from "../../interfaces";
import {Transaction} from "@chainsafe/metamask-polkadot-types";

export async function getTransactions(snap: SnapsGlobalObject): Promise<Transaction[]> {
  const state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  }) as MetamaskState;
  return state.polkadot.transactions;
}

