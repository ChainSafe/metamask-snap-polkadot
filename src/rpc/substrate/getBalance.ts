import {Wallet} from "../../interfaces";
import ApiPromise from "@polkadot/api/promise";
import {getKeyPair} from "../../polkadot/account";
import {Balance} from "@polkadot/types/interfaces";

/**
 * Returns balance as BN
 * @param wallet
 * @param api
 * @param address
 */
export async function getBalance(wallet: Wallet, api: ApiPromise, address?: string): Promise<Balance> {
  if(!address) {
    address = (await getKeyPair(wallet)).address;
  }
  const account = await api.query.system.account(address);
  return account.data.free;
}