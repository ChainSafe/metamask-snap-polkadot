import {Wallet} from "../interfaces";
import ApiPromise from "@polkadot/api/promise";

export async function send(wallet: Wallet, api: ApiPromise, signedData: string) {
    console.log(signedData);
}