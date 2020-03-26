import {Wallet} from "../../interfaces";
import ApiPromise from "@polkadot/api/promise";
import axios from "axios";

export async function getTransactions(wallet: Wallet, api: ApiPromise): Promise<string> {
  const state = wallet.getPluginState();
  if (state != null) {
    // eslint-disable-next-line max-len
    const response = await axios.get(`https://api-01.polkascan.io/kusama/api/v1/balances/transfer?&filter[address]=${state.polkadot.account.keyring.address}`);
    // const account = await api.query.system.account(state.polkadot.account.keyring.address);
    // return account.data.free.toHuman();
  }
  return null;
}