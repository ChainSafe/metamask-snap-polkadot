import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { hexToU8a } from '@polkadot/util';
import { getKeyPair } from '../../../src/polkadot/account';
import { testAddress, testAppKey, testPublicKey } from '../rpc/keyPairTestConstants';
import { westendConfiguration } from '../../../src/configuration/predefined';
import { getWalletMock } from '../wallet.mock';

chai.use(sinonChai);

describe('Test account function: getKeyPair', function () {
  const walletStub = getWalletMock();

  afterEach(function () {
    walletStub.reset();
  });

  it('should return keypair', async function () {
    walletStub.request.onFirstCall().returns({ polkadot: { configuration: westendConfiguration } });
    walletStub.request.onSecondCall().returns({ privateKey: testAppKey });
    const result = await getKeyPair();
    expect(result.address).to.be.eq(testAddress);
    expect(result.publicKey).to.be.deep.eq(hexToU8a(testPublicKey));
  });
});
