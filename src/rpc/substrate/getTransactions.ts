import {Wallet} from "../../interfaces";
import axios from "axios";
import {getAddress} from "../getAddress";

const explorerApiUrl = "https://api-01.polkascan.io/kusama/api/v1/balances/transfer";

/**
 * Query polkascan.io api for historic data about transactions for address.
 * @param wallet
 * @param address
 */
export async function getTransactions(wallet: Wallet, address?: string): Promise<unknown> {
  if(!address) {
    address = await getAddress(wallet);
  }
  // eslint-disable-next-line max-len
  const response = await axios.get(`${explorerApiUrl}?&filter[address]=${address}`);
  // if request is successful
  if (response.status >= 200 && response.status < 300) {
    const polResponse: PolkascanResponse = response.data;
    return polResponse.data;
  }
  return null;
}

interface PolkascanResponse {
  meta: unknown;
  errors: [];
  data: [];
  links: unknown;
}