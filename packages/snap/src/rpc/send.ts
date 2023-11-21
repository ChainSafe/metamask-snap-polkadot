import type { ApiPromise } from '@polkadot/api';
import type { Transaction, TxPayload } from '@chainsafe/metamask-polkadot-types';
import { saveTxToState } from '../polkadot/tx';
import { getAddress } from './getAddress';

export async function send(
  api: ApiPromise,
  signature: Uint8Array | `0x${string}`,
  txPayload: TxPayload
): Promise<Transaction> {
  const sender = await getAddress();
  const destination = txPayload.payload.address;

  const extrinsic = api.createType('Extrinsic', txPayload.tx);
  extrinsic.addSignature(sender, signature, txPayload.payload);

  const amount = extrinsic.args[1].toJSON();
  const paymentInfo = await api.tx.balances
    .transferKeepAlive(destination, String(amount))
    .paymentInfo(sender);

  const txHash = await api.rpc.author.submitExtrinsic(extrinsic);

  const tx = {
    amount: amount,
    block: txHash.toHex(),
    destination: destination,
    fee: String(paymentInfo.partialFee.toJSON()),
    hash: extrinsic.hash.toHex(),
    sender: sender
  } as Transaction;

  await saveTxToState(tx);
  return tx;
}
