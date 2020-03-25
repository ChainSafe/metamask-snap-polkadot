import {Wallet} from "../interfaces";
import {generateKeys} from "../crypto/keys";
import { u8aToHex } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/api';

export async function getPublicKey(wallet: Wallet): Promise<string> {
  const keyPairState = wallet.getPluginState();
  let keyringPair;
  if (keyPairState != null) {
    // keypair already saved
    await cryptoWaitReady();
    const keyring = new Keyring();
    keyringPair = keyring.addFromJson(keyPairState.polkadot.account.keyring);
  } else {
    // generate new keypair
    keyringPair = await generateKeys(wallet);
  }
  return u8aToHex(keyringPair.publicKey);
}
