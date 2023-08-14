import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { exportSeed } from '../../../src/rpc/exportSeed';
import { WalletMock } from '../wallet.mock.test';

chai.use(sinonChai);

describe('Test rpc handler function: exportSeed', function () {
  // eslint-disable-next-line
  // @ts-ignore
  const walletStub = global.snap as WalletMock;

  afterEach(function () {
    walletStub.reset();
  });

  it('should return seed on positive prompt confirmation and keyring saved in state', async function () {
    walletStub.request.onFirstCall().returns(true);
    walletStub.request
      .onSecondCall()
      .returns({ privateKey: 'aba2dd1a12eeafda3fda62aa6dfa21ca2aa6dfaba13fda6a22ea2dd1eafda1ca' });
    const result = await exportSeed();
    expect(result).to.be.eq('aba2dd1a12eeafda3fda62aa6dfa21ca');
  });

  it('should not return seed on negative prompt confirmation', async function () {
    walletStub.request.returns(false);
    const result = await exportSeed();
    expect(walletStub.request).to.have.been.calledOnce;
    expect(result).to.be.eq(null);
  });
});
