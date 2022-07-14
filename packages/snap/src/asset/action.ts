import {Asset, Wallet} from "../interfaces";

export function executeAssetOperation(
  asset: Partial<Asset>, wallet: Wallet, method: "update" | "add" | "remove"
): Promise<Asset> {
  return wallet.send({
    method: 'wallet_manageAssets',
    params: [ method, asset ],
  }) as Promise<Asset>;
}