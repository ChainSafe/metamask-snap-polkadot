import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { gemini3gConfiguration, gemini3fConfiguration } from '../../../src/configuration/predefined';
import { configure } from '../../../src/rpc/configure';
import { EmptyMetamaskState } from '../../../src/interfaces';
import { SnapConfig } from '@subspace/metamask-subspace-types';
import { getWalletMock } from '../wallet.mock';

chai.use(sinonChai);

describe('Test rpc handler function: configure', function () {
  const walletStub = getWalletMock();

  afterEach(function () {
    walletStub.reset();
  });

  it('should set predefined gemini-3g configuration', async function () {
    walletStub.request.returns(EmptyMetamaskState());
    // tested method
    const result = await configure('gemini-3g', {});

    // assertions
    expect(result).to.be.deep.eq(gemini3gConfiguration);
  });

  it('should set predefined gemini-3f configuration', async function () {
    walletStub.request.returns(EmptyMetamaskState());
    // tested method
    const result = await configure('gemini-3f', {});
    // assertions
    expect(result).to.be.deep.eq(gemini3fConfiguration);
  });

  it('should set custom configuration', async function () {
    walletStub.request.returns(EmptyMetamaskState());
    // stubs
    const customConfiguration: SnapConfig = {
      addressPrefix: 1,
      networkName: 'gemini-3g',
      unit: { customViewUrl: 'custom-view-url', decimals: 1, image: 'image', symbol: 'TST' },
      wsRpcUrl: 'ws-rpc-url'
    };
    // tested method
    const result = await configure('test-network', customConfiguration);
    // assertions
    expect(result).to.be.deep.eq(customConfiguration);
  });

  it('should set predefined gemini-3f configuration with additional property override', async function () {
    walletStub.request.returns(EmptyMetamaskState());
    // tested method
    const customConfiguration = gemini3fConfiguration;
    customConfiguration.unit.symbol = 'TST_KSM';
    const result = await configure('gemini-3f', {
      unit: { symbol: 'TST_KSM' }
    } as SnapConfig);
    // assertions
    expect(result).to.be.deep.eq(customConfiguration);
  });
});
