import {Wallet} from "../interfaces";
import {generateKeys} from "../crypto/keys";
import {iterableToHexString} from "../util";

export async function getPublicKey(wallet: Wallet): Promise<string> {
  const keyPairState = wallet.getPluginState();
  if (keyPairState != null && keyPairState.polkadot.account != null) {
    // keypair already saved
    const pk = keyPairState.polkadot.account.publicKey;
    return iterableToHexString(pk);
  } else {
    // generate new keypair
    const keypair = await generateKeys(wallet);
    return iterableToHexString(keypair.publicKey);
  }
}
