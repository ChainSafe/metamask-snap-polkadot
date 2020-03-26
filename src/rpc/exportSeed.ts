import {Wallet} from "../interfaces";
import {showConfirmationDialog} from "../util/confirmation";

export async function exportSeed(wallet: Wallet): Promise<string|null> {
  const state = wallet.getPluginState();
  if (state != null) {
    // ask for confirmation
    const confirmation = await showConfirmationDialog(
      wallet,
      'Do you want to export your seed?'
    );
    // return seed if user confirmed action
    if (confirmation) {
      return state.polkadot.account.seed;
    }
  }
  return null;
}