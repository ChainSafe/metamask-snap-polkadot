import {Wallet} from "../interfaces";
import ApiPromise from "@polkadot/api/promise";
import {getKeyPair} from "../polkadot/account";
import {showConfirmationDialog} from "../util/confirmation";


export async function sign(wallet: Wallet, api: ApiPromise, amount: string | number, to: string): Promise<string> {
    // ask user for confirmation
    const confirmation = await showConfirmationDialog(
        wallet,
        `Do you want to sign following transaction: \nSend ${amount} to ${to}`
    );
    // sign transaction if confirmed
    if (confirmation) {
        const keypair = await getKeyPair(wallet);
        const signedTx = api.tx.balances.transfer(to, amount).sign(keypair, {});
        return signedTx.toHex();
    } else {
        return ""
    }
}