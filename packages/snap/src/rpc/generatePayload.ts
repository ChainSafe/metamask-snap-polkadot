import ApiPromise from "@polkadot/api/promise";
import {SignerPayloadJSON} from '@polkadot/types/types';
import {Wallet} from "../interfaces";

export async function generatePayload(wallet: Wallet, api: ApiPromise, to: string, amount: string | number): Promise<SignerPayloadJSON> {
    let payload = api.registry.createType('SignerPayload', {amount, to});
    return payload.toPayload();
}