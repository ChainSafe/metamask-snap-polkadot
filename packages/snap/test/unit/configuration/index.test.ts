import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import type { SnapConfig } from '@subspace/metamask-subspace-types';
import { getConfiguration, getDefaultConfiguration } from '../../../src/configuration';
import {
  defaultConfiguration,
  gemini3gConfiguration,
  gemini3fConfiguration
} from '../../../src/configuration/predefined';
import { EmptyMetamaskState } from '../../../src/interfaces';
import type { WalletMock } from '../wallet.mock';
import { getWalletMock } from '../wallet.mock';

chai.use(sinonChai);

describe('Test configuration functions', function () {
  describe('getDefaultConfiguration', function () {
    it('should return gemini-3g configuration on "gemini-3g"', function () {
      const configuration = getDefaultConfiguration('gemini-3g');
      expect(configuration).to.be.deep.eq(gemini3gConfiguration);
    });

    it('should return gemini-3f configuration on "gemini-3f"', function () {
      const configuration = getDefaultConfiguration('gemini-3f');
      expect(configuration).to.be.deep.eq(gemini3fConfiguration);
    });

    it('should return default configuration on empty string', function () {
      const configuration = getDefaultConfiguration('');
      expect(configuration).to.be.deep.eq(defaultConfiguration);
    });

    it('should return default configuration on non network name string', function () {
      const configuration = getDefaultConfiguration('test');
      expect(configuration).to.be.deep.eq(defaultConfiguration);
    });
  });

  describe('getConfiguration', function () {
    let walletStub: WalletMock;

    before(function () {
      walletStub = getWalletMock();
    });

    afterEach(function () {
      walletStub.reset();
    });

    it('should return configuration saved in state"', async function () {
      const customConfiguration: SnapConfig = {
        addressPrefix: 5,
        networkName: 'gemini-3g',
        wsRpcUrl: 'url'
      };
      walletStub.request.returns({ config: JSON.stringify(customConfiguration) });
      const configuration = await getConfiguration();
      expect(configuration).to.be.deep.eq(customConfiguration);
    });

    it('should return default configuration on empty state"', async function () {
      walletStub.request.returns(EmptyMetamaskState());
      const configuration = await getConfiguration();
      expect(configuration).to.be.deep.eq(defaultConfiguration);
    });
  });
});
