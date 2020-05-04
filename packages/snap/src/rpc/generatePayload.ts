import ApiPromise from "@polkadot/api/promise";
import {SignerPayloadJSON} from '@polkadot/types/types';

export async function generatePayload(api: ApiPromise, to: string, amount: string | number): Promise<SignerPayloadJSON> {
    let submittableExtrinsic = api.tx.balances.transfer(to, amount);
    // TODO create SignerPayloadJson
    return submittableExtrinsic;
}