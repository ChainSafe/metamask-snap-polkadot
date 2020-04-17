import {Wallet} from "../interfaces";
import {getKeyPair} from "../polkadot/account";
import { encodeAddress } from "@polkadot/keyring";
import {getConfiguration} from "../configuration/index";

export async function getAddress(wallet: Wallet): Promise<string> {
  const keyPair = await getKeyPair(wallet);

  const snapConfig = getConfiguration(wallet);

  return encodeAddress(keyPair.publicKey, snapConfig.addressPrefix);
}