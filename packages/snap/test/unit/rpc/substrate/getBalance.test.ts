import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import type { ApiPromise } from '@polkadot/api/';
import type { AccountInfo } from '@polkadot/types/interfaces/system';
import sinon from 'sinon';
import { getBalance } from '../../../../src/rpc/substrate/getBalance';
import { testAddress, testAppKey } from '../keyPairTestConstants';
import { getWalletMock } from '../../wallet.mock';
import { EmptyMetamaskState } from '../../../../src/interfaces';

chai.use(sinonChai);

describe('Test rpc handler function: getBalance', function () {
  const walletStub = getWalletMock();

  afterEach(function () {
    walletStub.reset();
  });

  it('should return balance on saved keyring in state', async function () {
    // wallet stub
    walletStub.request.onFirstCall().returns(EmptyMetamaskState());
    walletStub.request.onSecondCall().returns({ privateKey: testAppKey });
    // api stub
    const apiStub = { query: { system: { account: sinon.stub() } } };
    apiStub.query.system.account.returns({ data: { free: '0' } } as unknown as AccountInfo);
    const api = apiStub as unknown as ApiPromise;
    const result = await getBalance(api);
    expect(result).to.be.eq('0');
    expect(apiStub.query.system.account).to.have.been.calledOnceWith(testAddress);
  });
});
