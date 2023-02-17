import {ApiPromise} from "@polkadot/api";
import {Transaction, TxPayload} from "@chainsafe/metamask-polkadot-types";
import {getAddress} from "./getAddress";
import {saveTxToState} from "../polkadot/tx";
import { SnapsGlobalObject } from "@metamask/snaps-types";

export async function send(
  snap: SnapsGlobalObject, api: ApiPromise, signature: Uint8Array | `0x${string}`, txPayload: TxPayload
): Promise<Transaction> {
  const sender = await getAddress(snap);
  const destination = txPayload.payload.address;

  const extrinsic = api.createType('Extrinsic', txPayload.tx);
  extrinsic.addSignature(sender, signature, txPayload.payload);

  const amount = extrinsic.args[1].toJSON();
  const paymentInfo = await api.tx.balances
    .transfer(destination, Number(amount.toString()))
    .paymentInfo(sender);

  const txHash = await api.rpc.author.submitExtrinsic(extrinsic);

  const tx = {
    amount: amount,
    block: txHash.toHex(),
    destination: destination,
    fee: paymentInfo.partialFee.toJSON(),
    hash: extrinsic.hash.toHex(),
    sender: sender,
  } as Transaction;

  await saveTxToState(snap, tx);
  return tx;
}
