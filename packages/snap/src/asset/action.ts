import { Asset } from '../interfaces';
import { getWalletMock } from '../../test/unit/wallet.mock';

export function executeAssetOperation(
  asset: Partial<Asset>,
  method: 'update' | 'add' | 'remove'
): Promise<Asset> {
  const snap = getWalletMock();
  return snap.send({
    method: 'wallet_manageAssets',
    params: [method, asset]
  }) as Promise<Asset>;
}
