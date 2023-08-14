import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { WalletMock } from '../wallet.mock.test';
import { getAddress } from '../../../src/rpc/getAddress';
import { testAppKey } from './keyPairTestConstants';
import { westendConfiguration } from '../../../src/configuration/predefined';

chai.use(sinonChai);

describe('Test rpc handler function: getAddress', function () {
  // eslint-disable-next-line
  // @ts-ignore
  const walletStub = global.snap as WalletMock;

  afterEach(function () {
    walletStub.reset();
  });

  it('should return valid address with westend configuration', async function () {
    walletStub.request.onFirstCall().returns({ configuration: westendConfiguration });
    walletStub.request.onSecondCall().returns({ privateKey: testAppKey });
    const result = await getAddress();
    expect(result).to.be.eq('5DW5CXHWbM13Az7aetLQVUEviNq8WeXFQanHNPVMmzyRYKvX');
  });
});
