import {Wallet} from "../interfaces";
import ApiPromise from "@polkadot/api/promise";
import { Hash } from '@polkadot/types/interfaces';
import {TxPayload} from "@nodefactory/metamask-polkadot-types";
import {getAddress} from "./getAddress";
import {txEventEmitter} from "../polkadot/events";

export async function send(wallet: Wallet, api: ApiPromise, signature: string, txPayload: TxPayload): Promise<Hash> {
    const extrinsic = api.createType('Extrinsic', txPayload.tx);
    extrinsic.addSignature((await getAddress(wallet)), signature, txPayload.payload);
    const txHash = extrinsic.hash.toHex();
    api.rpc.author.submitAndWatchExtrinsic(extrinsic, result => {
        const blockHash = result.hash.toHex();
        if (result.isInBlock) {
            txEventEmitter.emit("included", txHash, {txHash, blockHash});
            txEventEmitter.removeAllListeners("included", txHash);
        } else if (result.isFinalized) {
            txEventEmitter.emit("finalized", txHash, {txHash, blockHash});
            txEventEmitter.removeAllListeners("finalized", txHash);
        }
    });
    return extrinsic.hash;
}