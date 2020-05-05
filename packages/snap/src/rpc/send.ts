import {Wallet} from "../interfaces";
import ApiPromise from "@polkadot/api/promise";
import { Hash } from '@polkadot/types/interfaces';
import {TxPayload} from "@nodefactory/metamask-polkadot-types";
import {getAddress} from "./getAddress";

export async function send(wallet: Wallet, api: ApiPromise, signature: string, txPayload: TxPayload): Promise<Hash> {
    const extrinsic = api.createType('Extrinsic', txPayload.tx);
    extrinsic.addSignature((await getAddress(wallet)), signature, txPayload.payload);
    return await api.rpc.author.submitExtrinsic(extrinsic);
}