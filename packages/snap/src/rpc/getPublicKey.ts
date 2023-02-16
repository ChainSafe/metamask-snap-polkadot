import {u8aToHex} from '@polkadot/util';
import {getKeyPair} from "../polkadot/account";
import { SnapsGlobalObject } from '@metamask/snaps-types';

export async function getPublicKey(snap: SnapsGlobalObject): Promise<string> {
  const keyPair = await getKeyPair(snap);
  return u8aToHex(keyPair.publicKey);
}
