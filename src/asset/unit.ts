import {Asset, Wallet} from "../interfaces";
import ApiPromise from "@polkadot/api/promise";
import {getBalance} from "../rpc/substrate/getBalance";
import {getAddress} from "../rpc/getAddress";
import {executeAssetOperation} from "./executeAssetOperation";
import formatBalance from "@polkadot/util/format/formatBalance";
import {Balance} from "@polkadot/types/interfaces";
import {NetworkConfiguration} from "../network/network";

export function getPolkadotAssetDescription(
  balance: number|string|Balance,
  address: string,
  configuration: NetworkConfiguration): Asset
{
  // get custom view url
  const configurationUrl = configuration.unit.customViewUrl;
  const customViewUrl = typeof configurationUrl === "string" ? configurationUrl : configurationUrl(address);
  // get image url
  const image = configuration.unit.image ? configuration.unit.image : "";
  // return asset description
  return {
    balance: formatBalance(balance, {decimals: 0, withSi: true, withUnit: false}),
    customViewUrl: customViewUrl,
    decimals: 0,
    identifier: 'ksm-asset',
    image: image,
    symbol: configuration.unit.symbol,
  };
}

export async function createPolkadotAsset(wallet: Wallet, api: ApiPromise, method: "update" | "add"): Promise<Asset> {
  const state = wallet.getPluginState();
  const [balance, address] = await Promise.all([
    getBalance(wallet, api),
    getAddress(wallet)
  ]);
  const asset = getPolkadotAssetDescription(balance, address, state.polkadot.configuration);
  // remove asset if already created
  if (method === "add") {
    await executeAssetOperation({identifier: 'ksm-asset'} as Asset, wallet, "remove");
  }
  return await executeAssetOperation(asset, wallet, method);
}