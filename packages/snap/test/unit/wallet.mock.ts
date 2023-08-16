import { Asset, Wallet } from '../../src/interfaces';
import sinon from 'sinon';

export class WalletMock implements Wallet {
  public registerRpcMessageHandler = sinon.stub();
  public send = sinon.stub();
  public request = sinon.stub();

  public reset(): void {
    this.registerRpcMessageHandler.reset();
    this.send.reset();
    this.request.reset();
  }
}

export const getWalletMock = (): WalletMock => {
  // eslint-disable-next-line
  // @ts-ignore
  return global.snap as WalletMock;
};

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
