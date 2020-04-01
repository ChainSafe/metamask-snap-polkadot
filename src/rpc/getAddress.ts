import {Wallet} from "../interfaces";
import {getKeyPair} from "../polkadot/account";
import { encodeAddress } from "@polkadot/keyring";

export async function getAddress(wallet: Wallet): Promise<string> {
  const keyPair = await getKeyPair(wallet);
  return encodeAddress(keyPair.publicKey, 2);
}