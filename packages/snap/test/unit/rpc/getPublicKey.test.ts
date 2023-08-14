import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { getPublicKey } from '../../../src/rpc/getPublicKey';
import { WalletMock } from '../wallet.mock.test';
import { testAppKey, testPublicKey } from './keyPairTestConstants';
import { EmptyMetamaskState } from '../../../src/interfaces';

chai.use(sinonChai);

describe('Test rpc handler function: getPublicKey', function () {
  // eslint-disable-next-line
  // @ts-ignore
  const walletStub = global.snap as WalletMock;

  afterEach(function () {
    walletStub.reset();
  });

  it('should return pk', async function () {
    walletStub.request.onFirstCall().returns(EmptyMetamaskState());
    walletStub.request.onSecondCall().returns({ privateKey: testAppKey });
    const result = await getPublicKey();
    expect(result).to.be.eq(testPublicKey);
  });
});
