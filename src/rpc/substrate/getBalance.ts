import {Wallet} from "../../interfaces";
import ApiPromise from "@polkadot/api/promise";

export async function getBalance(wallet: Wallet, api: ApiPromise): Promise<string> {
  const state = wallet.getPluginState();
  if (state != null) {
    const account = await api.query.system.account(state.polkadot.account.keyring.address);
    return account.data.free.toHuman();
  }
  return null;
}