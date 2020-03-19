import {Wallet} from "../interfaces";
import {toHexString} from "../util/hex";
import {showConfirmationDialog} from "../util/confirmation";

export async function exportPrivateKey(wallet: Wallet): Promise<string> {
  const keyPairState = wallet.getPluginState();
  if (keyPairState != null) {
    // ask for confirmation
    const confirmation = await showConfirmationDialog(
      wallet,
      'Do you want to export your private key?'
    );
    // return private key
    if (confirmation) {
      // keypair already saved
      const sk = keyPairState.polkadot.account.secretKey;
      return toHexString(sk);
    }
  }
  return null;
}