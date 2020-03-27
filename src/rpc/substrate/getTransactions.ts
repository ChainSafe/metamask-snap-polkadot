import {Wallet} from "../../interfaces";
import axios from "axios";
import {getKeyPair} from "../../polkadot/getKeyPair";

const API_PATH = "https://api-01.polkascan.io/kusama/api/v1/balances/transfer";

/**
 * Query polkascan.io api for historic data about transactions for address.
 * @param wallet
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getTransactions(wallet: Wallet): Promise<any> {
  const keyPair = await getKeyPair(wallet);
  const response = await axios.get(`${API_PATH}?&filter[address]=${keyPair.address}`);
  // if request is successful
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  return null;
}