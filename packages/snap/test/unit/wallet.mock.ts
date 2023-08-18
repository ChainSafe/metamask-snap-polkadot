import sinon from 'sinon';
import { Wallet } from '../../src/interfaces';

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
