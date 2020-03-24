import {Wallet} from "../interfaces";
import {generateKeys} from "../crypto/keys";
import {toHexString} from "../util/hex";

export async function getPublicKey(wallet: Wallet): Promise<string> {
  const keyPairState = wallet.getPluginState();
  if (keyPairState != null) {
    // keypair already saved
    const pk = keyPairState.polkadot.account.publicKey;
    return toHexString(pk);
  } else {
    // generate new keypair
    const keypair = await generateKeys(wallet);
    return toHexString(keypair.publicKey);
  }
}
