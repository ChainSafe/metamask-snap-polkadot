import {Wallet} from "../interfaces";
import {getKeyPair} from "../polkadot/account";
import {getConfiguration} from "../configuration/index";
import {encodeAddress} from "@polkadot/keyring";

export async function getAddress(wallet: Wallet): Promise<string> {
  const keyPair = await getKeyPair(wallet);

  const snapConfig = getConfiguration(wallet);

  return encodeAddress(keyPair.publicKey, snapConfig.addressPrefix);
}