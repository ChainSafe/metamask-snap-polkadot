import {Asset, Wallet} from "../interfaces";
import ApiPromise from "@polkadot/api/promise";
import {getBalance} from "../rpc/substrate/getBalance";
import {getAddress} from "../rpc/getAddress";
import {executeAssetOperation} from "./executeAssetOperation";
import formatBalance from "@polkadot/util/format/formatBalance";
import {Balance} from "@polkadot/types/interfaces";
import {Configuration} from "../configuration/configuration";

export function getPolkadotAssetDescription(
  balance: number|string|Balance,
  address: string,
  configuration: Configuration): Asset
{
  // eslint-disable-next-line max-len
  const customViewUrl = configuration.unit.customViewUrl ? configuration.unit.customViewUrl.replace("${address}", address) : "";
  const image = configuration.unit.image ? configuration.unit.image : "";
  return {
    balance: formatBalance(balance, {decimals: 12, withSi: true, withUnit: false}),
    customViewUrl: customViewUrl,
    decimals: configuration.unit.decimals,
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