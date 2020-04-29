import ApiPromise from "@polkadot/api/promise";
import {Wallet} from "../../interfaces";
import {Hash} from '@polkadot/types/interfaces/runtime';
import {getKeyPair} from "../../polkadot/account";
import {txEventEmitter} from "../../polkadot/events";

export async function sendUnit(wallet: Wallet, api: ApiPromise, amount: string|number, to: string): Promise<Hash> {
  const keypair = await getKeyPair(wallet);
  const submittable = api.tx.balances.transfer(to, amount).sign(keypair, {});
  submittable.send();
  return submittable.hash;
}