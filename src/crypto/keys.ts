import {AccountState, Wallet} from "../interfaces";
import { Keyring } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { stringToU8a } from '@polkadot/util';

/**
 * Generate substrate keypair and saves it to wallet state
 * @param wallet
 */
export async function generateKeys(wallet: Wallet): Promise<KeyringPair> {
  // get app key and wait for api to be ready
  const [appKey] = await Promise.all([wallet.getAppKey(), cryptoWaitReady()]);
  // generate keys
  const seed = (appKey.substr(0, 32));
  const keyring = new Keyring();
  const keyringPair = keyring.addFromSeed(stringToU8a(seed));
  const accountState: AccountState = {keyring: keyringPair.toJson()};
  const state = wallet.getPluginState();
  state.polkadot.account = accountState;
  try {
    wallet.updatePluginState(state);
  } catch (e) {
    console.error("Failed to store generated polkadot account", keyringPair, e);
  }
  return keyringPair;
}

