import {Wallet} from "../../interfaces";
import ApiPromise from "@polkadot/api/promise";
import axios from "axios";

const API_PATH = "https://api-01.polkascan.io/kusama/api/v1/balances/transfer";

export async function getTransactions(wallet: Wallet, api: ApiPromise): Promise<string> {
  const state = wallet.getPluginState();
  if (state != null) {
    // eslint-disable-next-line max-len
    const response = await axios.get(`${API_PATH}?&filter[address]=${state.polkadot.account.keyring.address}`);


  }
  return null;
}