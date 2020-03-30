import {Asset, Wallet} from "../interfaces";
import ApiPromise from "@polkadot/api/promise";
import {getBalance} from "../rpc/substrate/getBalance";
import {getAddress} from "../rpc/getAddress";
import {executeAssetOperation} from "./executeAssetOperation";

export function getPolkadotAssetDescription(balance: string, address: string): Asset {
  return {
    balance: balance,
    customViewUrl: `https://polkascan.io/pre/kusama/account/${address}`,
    decimals: 0,
    identifier: 'ksm-asset',
    image: 'https://img.techpowerup.org/200330/kusama.png',
    symbol: 'KSM',
  };
}

export async function createPolkadotAsset(wallet: Wallet, api: ApiPromise, method: "update" | "add"): Promise<Asset> {
  const balance = await getBalance(wallet, api);
  const address = await getAddress(wallet);
  const asset = getPolkadotAssetDescription(balance, address);
  return await executeAssetOperation(asset, wallet, method);
}