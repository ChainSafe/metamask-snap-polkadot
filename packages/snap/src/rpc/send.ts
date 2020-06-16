import {Wallet} from "../interfaces";
import ApiPromise from "@polkadot/api/promise";
import {TxPayload} from "@nodefactory/metamask-polkadot-types";
import {getAddress} from "./getAddress";
import {getTxEventEmitter} from "../polkadot/events";

export async function send(wallet: Wallet, api: ApiPromise, signature: string, txPayload: TxPayload): Promise<string> {
  const extrinsic = api.createType('Extrinsic', txPayload.tx);
  extrinsic.addSignature((await getAddress(wallet)), signature, txPayload.payload);
  const txHash = extrinsic.hash.toHex();
  api.rpc.author.submitAndWatchExtrinsic(extrinsic, result => {
    const eventEmitter = getTxEventEmitter(txHash);
    if (result.isInBlock) {
      eventEmitter.emit("included", {txHash});
      eventEmitter.removeAllListeners("included");
    } else if (result.isFinalized) {
      eventEmitter.emit("finalized", {txHash});
      eventEmitter.removeAllListeners("finalized");
    }
  });
  return extrinsic.hash.toHex();
}
