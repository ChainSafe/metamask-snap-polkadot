import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {WalletMock} from "../wallet.mock.test";
import {Asset} from "../../../src/interfaces";
import {executeAssetOperation} from "../../../src/asset/action";
import {westendConfiguration} from "../../../src/configuration/predefined";
import {getApi} from "../../../src/polkadot/api";
import {registerOnBalanceChange, removeOnBalanceChange} from "../../../src/polkadot/events/balance";
import {testAppKey} from "../rpc/keyPairTestConstants";

chai.use(sinonChai);

describe('Test asset function: executeAssetOperation', function() {
  const walletStub = new WalletMock();
  const testAsset: Asset = {
    balance: "100",
    customViewUrl: `https://polkascan.io/`,
    decimals: 0,
    identifier: 'test-asset',
    image: 'image.png',
    symbol: 'TST',
  };

  afterEach(function() {
    walletStub.reset();
  });

  it('should ', async function () {
    walletStub.getPluginState.returns({polkadot: {config: westendConfiguration}});
    walletStub.getAppKey.returns("7b0f8ec12ac9fa5da14dddc002c8d991");
    await registerOnBalanceChange(walletStub, "test-origin")

    removeOnBalanceChange("test-origin")
  });

  it('should call add method with provided asset', async () => {
    // stubs
    walletStub.send.returns(testAsset);
    // tested method
    const result = await executeAssetOperation(testAsset, walletStub, "add");
    // assertions
    expect(result).not.to.be.null;
    expect(result).to.be.eq(testAsset);
    expect(walletStub.send).to.have.been.calledOnceWithExactly({
      method: 'wallet_manageAssets',
      params: ["add", testAsset]
    });
  });

  it('should call update method with provided asset', async () => {
    // stubs
    walletStub.send.returns(testAsset);
    // tested method
    const result = await executeAssetOperation(testAsset, walletStub, "update");
    // assertions
    expect(result).not.to.be.null;
    expect(result).to.be.eq(testAsset);
    expect(walletStub.send).to.have.been.calledOnceWithExactly({
      method: 'wallet_manageAssets',
      params: ["update", testAsset]
    });
  });

  it('should call remove method with provided asset', async () => {
    // stubs
    walletStub.send.returns(null);
    // tested method
    const result = await executeAssetOperation(testAsset, walletStub, "remove");
    // assertions
    expect(result).to.be.null;
    expect(walletStub.send).to.have.been.calledOnceWithExactly({
      method: 'wallet_manageAssets',
      params: ["remove", testAsset]
    });
  });
});