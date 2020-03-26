import {Wallet} from "../interfaces";

export async function getAddress(wallet: Wallet): Promise<string> {
  const state = wallet.getPluginState();
  if (state != null) {
    return state.polkadot.account.keyring.address;
  }
  return null;
}