import ApiPromise from "@polkadot/api/promise";
import {Wallet} from "../../interfaces";
import {Hash} from '@polkadot/types/interfaces/runtime';
import {getKeyPair} from "../../polkadot/account";
import {txEventEmitter} from "../../polkadot/events";

export async function sendUnit(wallet: Wallet, api: ApiPromise, amount: string|number, to: string): Promise<Hash> {
  const keypair = await getKeyPair(wallet);
  const signedTx = api.tx.balances.transfer(to, amount).sign(keypair, {});
  signedTx.send(({ status }) => {
    const hexHash = status.hash.toHex();
    if (status.isInBlock) {
      txEventEmitter.emit("inBlock", hexHash, {});
      txEventEmitter.removeAllListeners("inBlock", hexHash);
    } else if (status.isFinalized) {
      txEventEmitter.emit("finalized", hexHash, {});
      txEventEmitter.removeAllListeners("finalized", hexHash);
    }
  });
  return signedTx.hash;
}