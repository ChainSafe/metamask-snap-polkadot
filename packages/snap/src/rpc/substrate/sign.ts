import {ApiPromise} from "@polkadot/api/";
import { SignerPayloadJSON, SignerPayloadRaw } from "@polkadot/types/types";
import {getKeyPair} from "../../polkadot/account";
import { hexToU8a, u8aToHex } from "@polkadot/util";
import {showConfirmationDialog} from "../../util/confirmation";
import {messageCreator} from "../../util/messageCreator";
import { SnapsGlobalObject } from "@metamask/snaps-types";

export async function signPayloadJSON(
  snap: SnapsGlobalObject, api: ApiPromise, payload: SignerPayloadJSON
): Promise<{ signature: string }|void> {
  const keyPair = await getKeyPair(snap);
  const confirmation = await showConfirmationDialog(
    snap,
    {
      description: `It will be signed with address: ${keyPair.address}`,
      prompt: `Do you want to sign this message?`,
      textAreaContent: messageCreator(
        [
          {message: 'address', value: payload.address},
          {message: 'tip', value: payload.tip},
          {message: 'block number', value: payload.blockNumber},
          {message: 'block hash', value: payload.blockHash},
          {message: 'genesis hash', value: payload.genesisHash},
          {message: 'era', value: payload.era},
          {message: 'nonce', value: payload.nonce},
          {message: 'spec version', value: payload.specVersion},
          {message: 'transaction version', value: payload.transactionVersion},
        ]
      )
    }
  );
  if (confirmation) {
    const extrinsic = api.registry.createType('ExtrinsicPayload', payload, { version: payload.version });
    return extrinsic.sign(keyPair);
  }
}

export async function signPayloadRaw(
  snap: SnapsGlobalObject, api: ApiPromise, payload: SignerPayloadRaw
): Promise<{ signature: string }|void> {
  const keyPair = await getKeyPair(snap);
  // ask for confirmation
  const confirmation = await showConfirmationDialog(
    snap,
    {
      description: `It will be signed with address: ${keyPair.address}`,
      prompt: `Do you want to sign this message?`,
      textAreaContent: payload.data,
    }
  );
  // return seed if user confirmed action
  if (confirmation) {
    const signedBytes = keyPair.sign(hexToU8a(payload.data));
    return {
      signature: u8aToHex(signedBytes)
    };
  }
}