import {Wallet} from "../../interfaces";
import ApiPromise from "@polkadot/api/promise";
import {getKeyPair} from "../../polkadot/account";

export async function getBalance(wallet: Wallet, api: ApiPromise): Promise<string> {
  const keyPair = await getKeyPair(wallet);
  const account = await api.query.system.account(keyPair.address);
  console.log(account);
  return account.data.free.toHuman();
}