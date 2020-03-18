import {Wallet} from "../interfaces";
import {toHexString} from "../util/hex";

export async function exportPrivateKey(wallet: Wallet): Promise<string> {
  const keyPairState = wallet.getPluginState();
  if (keyPairState != null) {
    // ask for confirmation
    const confirmation = await wallet.send({
      method: 'confirm',
      params: ['Do you want to export your private key?']
    });
    // return private key
    if (confirmation.result == true) {
      // keypair already saved
      const sk = keyPairState.polkadot.account.secretKey;
      return toHexString(sk);
    }
  }
  return null;
}