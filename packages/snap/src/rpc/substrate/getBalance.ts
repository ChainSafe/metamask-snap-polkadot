import {Wallet} from "../../interfaces";
import ApiPromise from "@polkadot/api/promise";
import {getKeyPair} from "../../polkadot/account";
import {encodeAddress} from "@polkadot/keyring";

/**
 * Returns balance as BN
 * @param wallet
 * @param api
 * @param address
 */
export async function getBalance(wallet: Wallet, api: ApiPromise, address?: string): Promise<string> {
  if(!address) {
    address = (await getKeyPair(wallet)).address;
  }
  const encAddress = encodeAddress(
    (await getKeyPair(wallet)).publicKey,
    wallet.getPluginState().polkadot.config.addressPrefix
  );
  console.log(address);
  console.log(encAddress);
  const account = await api.query.system.account(encAddress);
  console.log(account);
  return account.data.free.toString();
}