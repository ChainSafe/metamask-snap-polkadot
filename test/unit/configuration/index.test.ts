import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {WalletMock} from "../crypto/wallet.mock.test";
import {EmptyMetamaskState} from "../../../src/interfaces";
import {setConfiguration} from "../../../src/configuration";
import {kusamaConfiguration, westendConfiguration} from "../../../src/configuration/predefined";
import {SnapConfig} from "../../../src/configuration/interfaces";

chai.use(sinonChai);

describe('Test setting configuration', function() {
  const walletStub = new WalletMock();

  afterEach(function() {
    walletStub.reset();
  });

  it('should set predefined kusama configuration', async function() {
    // stubs
    walletStub.getPluginState.returns(EmptyMetamaskState);
    // tested method
    const result = setConfiguration(walletStub, {network: "kusama"});
    // assertions
    expect(result).to.be.eq(kusamaConfiguration);
    expect(walletStub.updatePluginState).to.have.been.calledOnceWithExactly({
      polkadot: {
        account: null,
        config: kusamaConfiguration
      }
    });
  });

  it('should set predefined westend configuration', async function() {
    // stubs
    walletStub.getPluginState.returns(EmptyMetamaskState);
    // tested method
    const result = setConfiguration(walletStub, {network: "westend"});
    // assertions
    expect(result).to.be.eq(westendConfiguration);
    expect(walletStub.updatePluginState).to.have.been.calledOnceWithExactly({
      polkadot: {
        account: null,
        config: westendConfiguration
      }
    });
  });

  it('should set custom configuration', async function() {
    // stubs
    walletStub.getPluginState.returns(EmptyMetamaskState);
    const customConfiguration: SnapConfig = {
      network: {addressPrefix: 1, wsRpcUrl: "ws-rpc-url"},
      unit: {customViewUrl: "custom-view-url", image: "image", symbol: "TST" }
    };
    // tested method
    const result = setConfiguration(walletStub, customConfiguration);
    // assertions
    expect(result).to.be.deep.eq(customConfiguration);
    expect(walletStub.updatePluginState).to.have.been.calledOnceWithExactly({
      polkadot: {
        account: null,
        config: customConfiguration
      }
    });
  });
});