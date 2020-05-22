import {Asset, Wallet} from "../interfaces";
import {getAddress} from "../rpc/getAddress";
import {executeAssetOperation} from "./action";
import formatBalance from "@polkadot/util/format/formatBalance";
import {Balance} from "@polkadot/types/interfaces";
import {getConfiguration} from "../configuration";
import {SnapConfig} from "@nodefactory/metamask-polkadot-types";

export const POLKADOT_SNAP_ASSET_IDENTIFIER = "polkadot-snap-asset";

export function getPolkadotAssetDescription(
  balance: number|string|Balance, address: string, configuration: SnapConfig
): Asset {
  return {
    balance: formatBalance(balance, {decimals: configuration.unit.decimals, withSi: true, withUnit: false}),
    customViewUrl: configuration.unit.customViewUrl ||
        `https://polkascan.io/pre/${configuration.networkName}/account/${address}`,
    decimals: 0,
      identifier: POLKADOT_SNAP_ASSET_IDENTIFIER,
    image: configuration.unit.image || "",
    symbol: configuration.unit.symbol,
  };
}

let assetState: { balance: string | number; network: string };

export async function updateAsset(
  wallet: Wallet, origin: string, balance: number|string|Balance
): Promise<void> {
  const configuration = getConfiguration(wallet);
  // const newBalance = formatBalance(balance, {decimals: 12, withSi: true, withUnit: false});
  const asset = getPolkadotAssetDescription(balance, await getAddress(wallet), configuration);
  if (!assetState) {
    // create polkadot snap asset
    await executeAssetOperation(asset, wallet, "add");
  } else if (assetState.balance !== asset.balance || assetState.network !== configuration.networkName) {
    // update if balance or network changed
    await executeAssetOperation(asset, wallet, "update");
  }
  assetState = {balance: asset.balance, network: configuration.networkName};
}