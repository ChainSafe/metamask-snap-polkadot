import {Wallet} from "../../interfaces";
import {initApi} from "../../polkadot/initApi";

export async function getBalance(wallet: Wallet): Promise<string> {
  const api = await initApi();
  const state = wallet.getPluginState();
  if (state != null) {
    const account = await api.query.system.account(state.polkadot.account.keyring.address);
    return account.data.free.toHuman();
  }
  return null;
}