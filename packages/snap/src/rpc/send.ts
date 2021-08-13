import {Wallet} from "../interfaces";
import ApiPromise from "@polkadot/api/promise";
import {Transaction, TxPayload} from "@chainsafe/metamask-polkadot-types";
import {getAddress} from "./getAddress";
import {getTxEventEmitter} from "../polkadot/events";
import {saveTxToState, updateTxInState} from "../polkadot/tx";

export async function send(
  wallet: Wallet, api: ApiPromise, signature: string, txPayload: TxPayload
): Promise<Transaction> {
  const sender = await getAddress(wallet);
  const destination = txPayload.payload.address;

  const extrinsic = api.createType('Extrinsic', txPayload.tx);
  extrinsic.addSignature(sender, signature, txPayload.payload);
  const txHash = extrinsic.hash.toHex();

  const amount = extrinsic.args[1].toJSON();
  const paymentInfo = await api.tx.balances
    .transfer(destination, Number(amount.toString()))
    .paymentInfo(sender);
  const tx = {
    amount: amount,
    block: "",
    destination: destination,
    fee: paymentInfo.partialFee.toJSON(),
    hash: extrinsic.hash.toHex(),
    sender: sender,
  } as Transaction;

  api.rpc.author.submitAndWatchExtrinsic(extrinsic, result => {
    const eventEmitter = getTxEventEmitter(txHash);
    if (result.isInBlock) {
      tx.block = result.hash.toHex();
      updateTxInState(wallet, tx);
      eventEmitter.emit("included", {txHash});
      eventEmitter.removeAllListeners("included");
    } else if (result.isFinalized) {
      eventEmitter.emit("finalized", {txHash});
      eventEmitter.removeAllListeners("finalized");
    }
  });

  saveTxToState(wallet, tx);
  return tx;
}
