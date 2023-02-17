import { SnapsGlobalObject } from "@metamask/snaps-types";
import {getKeyPair} from "../polkadot/account";

export async function getAddress(snap: SnapsGlobalObject): Promise<string> {
  const keyPair = await getKeyPair(snap);
  return keyPair.address;
}