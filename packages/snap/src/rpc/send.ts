import {Wallet} from "../interfaces";
import ApiPromise from "@polkadot/api/promise";
import { Hash } from '@polkadot/types/interfaces';
import {TxPayload} from "@nodefactory/metamask-polkadot-types";
import {getAddress} from "./getAddress";
import {txEventEmitter} from "../polkadot/events";

export async function send(wallet: Wallet, api: ApiPromise, signature: string, txPayload: TxPayload): Promise<Hash> {
    const extrinsic = api.createType('Extrinsic', txPayload.tx);
    extrinsic.addSignature((await getAddress(wallet)), signature, txPayload.payload);
    api.rpc.author.submitAndWatchExtrinsic(extrinsic, result => {
        const hexHash = result.hash.toHex();
        if (result.isInBlock) {
            txEventEmitter.emit("included", hexHash, {tx: hexHash});
            txEventEmitter.removeAllListeners("included", hexHash);
        } else if (result.isFinalized) {
            txEventEmitter.emit("finalized", hexHash, {tx: hexHash});
            txEventEmitter.removeAllListeners("finalized", hexHash);
        }
    });
    return extrinsic.hash;
}