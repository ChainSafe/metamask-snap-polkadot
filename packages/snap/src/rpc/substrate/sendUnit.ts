import ApiPromise from "@polkadot/api/promise";
import {Wallet} from "../../interfaces";
import { Keyring } from "@polkadot/api";
import { Hash } from '@polkadot/types/interfaces/runtime';

export async function sendUnit(wallet: Wallet, api: ApiPromise, amount: string|number, to: string): Promise<Hash> {
  const keyring = new Keyring();
  const keypair = keyring.addFromJson(wallet.getPluginState().polkadot.account.keyring);
  const { nonce } = await api.query.system.account(keypair.address);
  const transfer = api.tx.balances.transfer(to, amount);
  return new Promise((resolve) => {
    transfer.signAndSend(keypair, {nonce}, ({ events = [], status }) => {
      if (status.isInBlock) {
        console.log('Included at block hash', status.asInBlock.toHex());
        resolve(status.asInBlock);
      }
    });
  });
}