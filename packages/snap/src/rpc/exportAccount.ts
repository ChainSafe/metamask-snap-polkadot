import type { KeyringPair$Json } from '@polkadot/keyring/types';
import { getKeyPair } from '../polkadot/account';
import { showConfirmationDialog } from '../util/confirmation';

export async function getAddress(): Promise<KeyringPair$Json> {
  const confirmation = await showConfirmationDialog({
    prompt: 'Do you want to export your account?'
  });

  if (confirmation) {
    const keyPair = await getKeyPair();
    return keyPair.toJson();
  }
  return null;
}
