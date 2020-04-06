import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {emptyMetamaskState} from "../../../src/interfaces";
import {WalletMock} from "../crypto/wallet.mock.test";
import {
  getConfiguration, setConfiguration
} from "../../../src/configuration/configuration";
import {defaultConfiguration, kusamaConfiguration, westendConfiguration} from "../../../src/network/configurations";
import {NetworkConfiguration} from "../../../src/network/network";

chai.use(sinonChai);

describe('Test configuration methods', () => {

  const walletStub = new WalletMock();

  const testConfiguration: NetworkConfiguration = {
    addressPrefix: 2,
    wsRpcUrl: "rpc-test-url",
    unit: {customViewUrl: "view-test-url",  image:"test-image", symbol: "TEST"}
  };

  beforeEach(function () {
    walletStub.reset();
  });

  it('should return default configuration if no configuration saved to state', async function () {
    walletStub.getPluginState.returns(emptyMetamaskState);
    walletStub.updatePluginState.returns({});
    const conf = await getConfiguration(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.updatePluginState).to.have.been.calledOnce;
    expect(conf).to.be.eq(defaultConfiguration);
  });

  it('should save provided configuration to state', async function () {
    walletStub.getPluginState.returns(emptyMetamaskState);
    await setConfiguration(walletStub, {network: testConfiguration});
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.updatePluginState).to.have.been.calledOnceWith({
      polkadot: {
        account: null,
        configuration: testConfiguration
      }
    });
  });

  it('should return configuration saved to state', async function () {
    walletStub.getPluginState.returns({polkadot: {account: null, configuration: testConfiguration}});
    const conf = await getConfiguration(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(conf).to.be.eq(testConfiguration);
  });

  it('should save kusama configuration to state', async function () {
    walletStub.getPluginState.returns(emptyMetamaskState);
    const result = await setConfiguration(walletStub, {network: "kusama"});
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.updatePluginState).to.have.been.calledOnceWith({
      polkadot: {
        account: null,
        configuration: kusamaConfiguration
      }
    });
    expect(result).to.be.eq(kusamaConfiguration);
  });

  it('should save westend configuration to state', async function () {
    walletStub.getPluginState.returns(emptyMetamaskState);
    const result = await setConfiguration(walletStub, {network: "westend"});
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.updatePluginState).to.have.been.calledOnceWith({
      polkadot: {
        account: null,
        configuration: westendConfiguration
      }
    });
    expect(result).to.be.eq(westendConfiguration);
  });

});
