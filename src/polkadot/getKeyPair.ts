import {Wallet} from "../interfaces";
import {generateKeys} from "../crypto/keys";
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';

/**
 * Returns KeyringPair if one is saved in wallet state, creates new one otherwise
 * @param wallet
 */
export async function getKeyPair(wallet: Wallet): Promise<KeyringPair> {
  const keyPairState = wallet.getPluginState();
  let keyringPair: KeyringPair;
  if (keyPairState != null) {
    // keypair already saved
    await cryptoWaitReady();
    const keyring = new Keyring();
    keyringPair = keyring.addFromJson(keyPairState.polkadot.account.keyring);
  } else {
    // generate new keypair
    keyringPair = await generateKeys(wallet);
  }
  return keyringPair;
}