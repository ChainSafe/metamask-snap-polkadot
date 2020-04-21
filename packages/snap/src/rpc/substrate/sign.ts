import {Wallet} from "../../interfaces";
import ApiPromise from "@polkadot/api/promise";
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import {getKeyPair} from "../../polkadot/account";
import {hexToU8a, u8aToHex} from "@polkadot/util";

export async function signPayloadJSON(
  wallet: Wallet, api: ApiPromise, payload: SignerPayloadJSON
): Promise<{ signature: string }> {
  const extrinsic = api.registry.createType('ExtrinsicPayload', payload, { version: payload.version });
  const keyPair = await getKeyPair(wallet);
  return extrinsic.sign(keyPair);
}

export async function signPayloadRaw(
  wallet: Wallet, api: ApiPromise, payload: SignerPayloadRaw
): Promise<{ signature: string }> {
  const keyPair = await getKeyPair(wallet);
  const signedBytes = keyPair.sign(hexToU8a(payload.data));
  return {
    signature: u8aToHex(signedBytes)
  };
}