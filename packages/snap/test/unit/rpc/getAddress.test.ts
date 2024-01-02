import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { gemini3gConfiguration } from '../../../src/configuration/predefined';
import { getAddress } from '../../../src/rpc/getAddress';
import { getWalletMock } from '../wallet.mock';
import { testAppKey } from './keyPairTestConstants';

chai.use(sinonChai);

describe('Test rpc handler function: getAddress', function () {
  const walletStub = getWalletMock();

  afterEach(function () {
    walletStub.reset();
  });

  it('should return valid address with westend configuration', async function () {
    walletStub.request.onFirstCall().returns({ configuration: gemini3gConfiguration });
    walletStub.request.onSecondCall().returns({ privateKey: testAppKey });
    const result = await getAddress();
    expect(result).to.be.eq('5DW5CXHWbM13Az7aetLQVUEviNq8WeXFQanHNPVMmzyRYKvX');
  });
});
