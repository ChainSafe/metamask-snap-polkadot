import {Asset, Wallet} from "../interfaces";

export function executeAssetOperation(asset: Asset, wallet: Wallet, method: "update" | "add"): Promise<Asset> {
  return wallet.send({
    method: 'wallet_manageAssets',
    params: [ method, asset ],
  }) as Promise<Asset>;
}