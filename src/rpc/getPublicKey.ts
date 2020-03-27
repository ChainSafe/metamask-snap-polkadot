import { u8aToHex } from '@polkadot/util';
import {getKeyPair} from "../polkadot/getKeyPair";
import {Wallet} from "../interfaces";

export async function getPublicKey(wallet: Wallet): Promise<string> {
  const keyPair = await getKeyPair(wallet);
  return u8aToHex(keyPair.publicKey);
}
