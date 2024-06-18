import { getKeyPair } from '../polkadot/account';
import { showConfirmationDialog } from '../util/confirmation';

export async function exportAccount(jsonPassphrase?: string): Promise<string> {
  const confirmation = await showConfirmationDialog({
    prompt: 'Do you want to export your account?'
  });

  if (confirmation) {
    const keyPair = await getKeyPair();
    return JSON.stringify(keyPair.toJson(jsonPassphrase));
  }
  return null;
}
