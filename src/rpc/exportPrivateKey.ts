import {Wallet} from "../interfaces";
import {toHexString} from "../util/hex";

export async function exportPrivateKey(wallet: Wallet): Promise<string> {
  const keyPairState = wallet.getPluginState();
  if (keyPairState != null) {
    // keypair already saved
    const sk = keyPairState.polkadot.account.secretKey;
    return toHexString(sk);
  }
  return null;
}