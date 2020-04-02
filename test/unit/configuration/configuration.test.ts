import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {emptyMetamaskState, MetamaskState} from "../../../src/interfaces";
import {WalletMock} from "../crypto/wallet.mock.test";
import {
  Configuration,
  defaultConfiguration,
  getConfiguration,
  setConfiguration
} from "../../../src/configuration/configuration";

chai.use(sinonChai);

describe('Test configuration methods', () => {

  const walletStub = new WalletMock();

  const testConfiguration: Configuration = {
    addressPrefix: 2,
    rpcUrl: "rpc-test-url",
    unit: {customViewUrl: "view-test-url", decimals: 0,  image:"test-image", symbol: "TEST"}
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
    await setConfiguration(walletStub, testConfiguration);
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

});
