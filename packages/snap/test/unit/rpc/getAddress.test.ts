import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {WalletMock} from "../wallet.mock.test";
import {getAddress} from "../../../src/rpc/getAddress";
import {testAppKey} from "./keyPairTestConstants";
import {defaultConfiguration} from "../../../src/configuration/predefined";

chai.use(sinonChai);

describe('Test rpc handler function: getAddress', function() {

  const walletStub = new WalletMock();

  afterEach(function() {
    walletStub.reset();
  });

  it('should return address on saved keyring in state', async function () {
    walletStub.getAppKey.returns(testAppKey);
    walletStub.getPluginState.returns({polkadot: {configuration: defaultConfiguration}});
    const result = await getAddress(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(result).to.be.eq("E1grqdPDi1xvdw2Rb9TPRbvry7NKKLRrxd2m3mKFoBvHZqj");
  });
});
