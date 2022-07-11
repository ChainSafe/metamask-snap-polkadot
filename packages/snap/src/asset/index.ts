import {Asset} from "../interfaces";
import {formatBalance} from "@polkadot/util/format/formatBalance";
import {Balance} from "@polkadot/types/interfaces";
import {SnapConfig} from "@chainsafe/metamask-polkadot-types";

export const POLKADOT_SNAP_ASSET_IDENTIFIER = "polkadot-snap-asset";

export function getPolkadotAssetDescription(
  balance: number|string|Balance, address: string, configuration: SnapConfig
): Asset {
  return {
    balance: formatBalance(balance, {decimals: configuration.unit.decimals, withSi: true, withUnit: false}),
    customViewUrl: configuration.unit.customViewUrl || "",
    decimals: 0,
    identifier: POLKADOT_SNAP_ASSET_IDENTIFIER,
    image: configuration.unit.image || "",
    symbol: configuration.unit.symbol,
  };
}
