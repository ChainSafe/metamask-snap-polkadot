import type { JsonBIP44CoinTypeNode } from '@metamask/key-tree';
import { showConfirmationDialog } from '../util/confirmation';
import { getConfiguration } from '../configuration';
import { getCoinTypeByNetwork } from '../polkadot/account';

export async function exportSeed(): Promise<string | null> {
  const configuration = await getConfiguration();
  const coinType = getCoinTypeByNetwork(configuration.networkName);

  // ask for confirmation
  const confirmation = await showConfirmationDialog({
    prompt: 'Do you want to export your seed?'
  });
  // return seed if user confirmed action
  if (confirmation) {
    const bip44Node = (await snap.request({
      method: 'snap_getBip44Entropy',
      params: { coinType: coinType }
    })) as JsonBIP44CoinTypeNode;
    return bip44Node.privateKey.slice(0, 32);
  }
  return null;
}
