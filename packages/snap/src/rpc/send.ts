import {Wallet} from "../interfaces";
import ApiPromise from "@polkadot/api/promise";
import { Hash } from '@polkadot/types/interfaces';
import {TxPayload} from "@nodefactory/metamask-polkadot-types";
import {SubmittableExtrinsic} from "@polkadot/api/types";
import {getAddress} from "./getAddress";

export async function send(wallet: Wallet, api: ApiPromise, signature: string, txPayload: TxPayload): Promise<Hash> {
    const transaction: SubmittableExtrinsic<'promise'> =
        api.tx[txPayload.tx.method.section][txPayload.tx.method.method](...txPayload.tx.method.args);
    transaction.addSignature((await getAddress(wallet)), signature, txPayload.payload);
    return await transaction.send();
}