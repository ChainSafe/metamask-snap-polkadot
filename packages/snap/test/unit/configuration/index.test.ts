import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {getConfiguration, getDefaultConfiguration} from "../../../src/configuration";
import {defaultConfiguration, kusamaConfiguration, westendConfiguration} from "../../../src/configuration/predefined";
import {WalletMock} from "../wallet.mock.test";
import {EmptyMetamaskState} from "../../../src/interfaces";
import {SnapConfig} from "@chainsafe/metamask-polkadot-types";

chai.use(sinonChai);

describe('Test configuration functions', function() {
  describe('getDefaultConfiguration', function () {

    it('should return kusama configuration on "kusama"', function () {
      const configuration = getDefaultConfiguration("kusama");
      expect(configuration).to.be.deep.eq(kusamaConfiguration);
    });

    it('should return westend configuration on "westend"', function () {
      const configuration = getDefaultConfiguration("westend");
      expect(configuration).to.be.deep.eq(westendConfiguration);
    });

    it('should return default configuration on empty string', function () {
      const configuration = getDefaultConfiguration("");
      expect(configuration).to.be.deep.eq(defaultConfiguration);
    });

    it('should return default configuration on non network name string', function () {
      const configuration = getDefaultConfiguration("test");
      expect(configuration).to.be.deep.eq(defaultConfiguration);
    });
  });

  describe('getConfiguration', function () {
    const walletStub = new WalletMock();

    afterEach(function() {
      walletStub.reset();
    });

    it('should return configuration saved in state"', async function () {
      const customConfiguration: SnapConfig = {addressPrefix: 5, networkName: "westmint", wsRpcUrl: "url"};
      walletStub.request.returns({polkadot: {config: customConfiguration}});
      const configuration = await getConfiguration(walletStub);
      expect(configuration).to.be.deep.eq(customConfiguration);
    });

    it('should return default configuration on empty state"', async function () {
      walletStub.request.returns(EmptyMetamaskState());
      const configuration = await getConfiguration(walletStub);
      expect(configuration).to.be.deep.eq(defaultConfiguration);
    });
  });
});