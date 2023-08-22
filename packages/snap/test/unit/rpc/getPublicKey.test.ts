import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { getPublicKey } from '../../../src/rpc/getPublicKey';
import { EmptyMetamaskState } from '../../../src/interfaces';
import { getWalletMock } from '../wallet.mock';
import { testAppKey, testPublicKey } from './keyPairTestConstants';

chai.use(sinonChai);

describe('Test rpc handler function: getPublicKey', function () {
  const walletStub = getWalletMock();

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
