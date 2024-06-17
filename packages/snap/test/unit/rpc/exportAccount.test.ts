import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { getWalletMock } from '../wallet.mock';
import { exportAccount } from "../../../src/rpc/exportAccount"

chai.use(sinonChai);

describe('Test rpc handler function: exportAccount', function () {
  const walletStub = getWalletMock();

  const privateKey = 'aba2dd1a12eeafda3fda62aa6dfa21ca2aa6dfaba13fda6a22ea2dd1eafda1ca'
  const nonEncodedResult = '{"encoded":"MFMCAQEwBQYDK2VwBCIEIGFiYTJkZDFhMTJlZWFmZGEzZmRhNjJhYTZkZmEyMWNhzwQ+E9kijYqTHOTMWO+9GtbF4vGTLDF06xUN+vkWW3OhIwMhAM8EPhPZIo2KkxzkzFjvvRrWxeLxkywxdOsVDfr5Fltz","encoding":{"content":["pkcs8","ed25519"],"type":["none"],"version":"3"},"address":"5Gk92fkWPUg6KNHSfP93UcPFhwGurM9RKAKU62Dg6upaCfH7","meta":{}}';
  afterEach(function () {
    walletStub.reset();
  });

  it('should return stringified json account on positive prompt', async function () {
    walletStub.request.onFirstCall().returns(true);
    walletStub.request
      .onThirdCall()
      .returns({ privateKey });
    const result = await exportAccount();
    expect(result).to.be.eq(nonEncodedResult);
  });

  it('returned encoded json should be different from non encoded json', async function () {
    walletStub.request.onFirstCall().returns(true);
    walletStub.request
      .onThirdCall()
      .returns({ privateKey: 'aba2dd1a12eeafda3fda62aa6dfa21ca2aa6dfaba13fda6a22ea2dd1eafda1ca' });
    const encodedResult = await exportAccount("password");
    
    expect(encodedResult).not.to.be.eq(nonEncodedResult)
  });

  it('should return null on negative prompt', async function () {
    walletStub.request.onFirstCall().returns(false);
    const result = await exportAccount();
    expect(result).to.be.eq(null);
  });
});
