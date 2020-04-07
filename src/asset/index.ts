import {Asset, Wallet} from "../interfaces";
import {getAddress} from "../rpc/getAddress";
import {executeAssetOperation} from "./action";
import formatBalance from "@polkadot/util/format/formatBalance";
import {Balance} from "@polkadot/types/interfaces";
import {UnitConfiguration} from "../configuration/interfaces";
import merge from "deepmerge";

const assets: Map<string, Asset> = new Map<string, Asset>();

function getIdentifier(origin: string, id: string): string {
  return `${origin}_${id}`;
}

export function getKusamaAsset(
  assetId: string, balance: number|string|Balance, address: string, configuration: UnitConfiguration
): Asset {
  return merge(configuration, {
    balance: formatBalance(balance, {decimals: 12, withSi: true, withUnit: false}),
    customViewUrl: `https://polkascan.io/pre/kusama/account/${address}`,
    decimals: 0,
    identifier: assetId,
    image: "",
    symbol: "KSM",
  });
}

export async function removeAsset(wallet: Wallet, origin: string, assetId: string): Promise<boolean> {
  await executeAssetOperation({identifier: assetId}, wallet, "remove");
  assets.delete(getIdentifier(origin, assetId));
  return true;
}

export async function updateAsset(
  wallet: Wallet, origin: string, assetId: string, balance: number|string|Balance
): Promise<boolean> {
  console.log("Updating asset", origin, assetId);
  if(assets.has(getIdentifier(origin, assetId))) {
    const asset = assets.get(getIdentifier(origin, assetId));
    asset.balance = formatBalance(balance, {decimals: 12, withSi: true, withUnit: false});
    await executeAssetOperation(asset, wallet, "update");
  } else {
    const state = wallet.getPluginState();
    const asset = getKusamaAsset(assetId, 0, await getAddress(wallet), state.polkadot.config.unit);
    await removeAsset(wallet, origin, assetId);
    await executeAssetOperation(asset, wallet, "add");
    assets.set(getIdentifier(origin, assetId), asset);
  }
  return true;
}