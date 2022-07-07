import { JsonBIP44CoinTypeNode } from "@metamask/key-tree";
import {Wallet} from "../interfaces";
import {showConfirmationDialog} from "../util/confirmation";

const kusamaCoinType = 434;

export async function exportSeed(wallet: Wallet): Promise<string|null> {
  // ask for confirmation
  const confirmation = await showConfirmationDialog(
    wallet,
    { prompt: 'Do you want to export your seed?' }
  );
  // return seed if user confirmed action
  if (confirmation) {
    const bip44Node = (await wallet.request({
      method: `snap_getBip44Entropy_${kusamaCoinType}`,
      params: [],
    })) as JsonBIP44CoinTypeNode;
  
    const seed = bip44Node.key.slice(0, 32);
    return seed;
  }
  return null;
}