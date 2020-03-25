import {AccountState, Wallet} from "../interfaces";
import { Keyring } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { stringToU8a } from '@polkadot/util';

// Generate keypair from metamask wallet interface using app key
export async function generateKeys(wallet: Wallet): Promise<KeyringPair> {
  // const api = await initApi();
  // wait for api to be ready
  await cryptoWaitReady();
  // generate keys
  const seed = wallet.getAppKey().substr(0, 32);
  const keyring = new Keyring();
  const keyringPair = keyring.addFromSeed(stringToU8a(seed));
  const accountState = {keyring: keyringPair.toJson(), seed} as AccountState;
  try {
    wallet.updatePluginState({polkadot: {account: accountState}});
  } catch (e) {
    console.error("Failed to store generated polkadot account", keyringPair, e);
  }
  return keyringPair;
}

