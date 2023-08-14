import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { WalletMock } from '../wallet.mock.test';
import { kusamaConfiguration, westendConfiguration } from '../../../src/configuration/predefined';
import { configure } from '../../../src/rpc/configure';
import { EmptyMetamaskState } from '../../../src/interfaces';
import { SnapConfig } from '@chainsafe/metamask-polkadot-types';

chai.use(sinonChai);

describe('Test rpc handler function: configure', function () {
  // eslint-disable-next-line
  // @ts-ignore
  const walletStub = global.snap as WalletMock;

  afterEach(function () {
    walletStub.reset();
  });

  it('should set predefined kusama configuration', async function () {
    walletStub.request.returns(EmptyMetamaskState());
    // tested method
    const result = await configure('kusama', {});

    // assertions
    expect(result).to.be.deep.eq(kusamaConfiguration);
  });

  it('should set predefined westend configuration', async function () {
    walletStub.request.returns(EmptyMetamaskState());
    // tested method
    const result = await configure('westend', {});
    // assertions
    expect(result).to.be.deep.eq(westendConfiguration);
  });

  it('should set custom configuration', async function () {
    walletStub.request.returns(EmptyMetamaskState());
    // stubs
    const customConfiguration: SnapConfig = {
      addressPrefix: 1,
      networkName: 'westend',
      unit: { customViewUrl: 'custom-view-url', decimals: 1, image: 'image', symbol: 'TST' },
      wsRpcUrl: 'ws-rpc-url'
    };
    // tested method
    const result = await configure('test-network', customConfiguration);
    // assertions
    expect(result).to.be.deep.eq(customConfiguration);
  });

  it('should set predefined kusama configuration with additional property override', async function () {
    walletStub.request.returns(EmptyMetamaskState());
    // tested method
    const customConfiguration = kusamaConfiguration;
    customConfiguration.unit.symbol = 'TST_KSM';
    const result = await configure('kusama', {
      unit: { symbol: 'TST_KSM' }
    } as SnapConfig);
    // assertions
    expect(result).to.be.deep.eq(customConfiguration);
  });
});
