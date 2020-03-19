import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {MetamaskState} from "../../../src/interfaces";
import {getPublicKey} from "../../../src/rpc/getPublicKey";
import {WalletMock} from "../crypto/wallet.mock.test";

chai.use(sinonChai);

describe('Test rpc handler function: getPublicKey', () => {

  const walletStub = new WalletMock();

  afterEach(function () {
    walletStub.reset();
  });

  it('should return pk on saved pk in state', async function () {
    walletStub.getPluginState.returns({polkadot: {account: {
      publicKey: Uint8Array.from([1, 2, 3]),
      secretKey: Uint8Array.from([1, 2, 3, 4]),
    }}} as MetamaskState);
    const result = await getPublicKey(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(result).to.be.eq("0x010203");
  });

  it('should create new keypair on no pk saved in state', async function () {
    walletStub.getPluginState.returns(null);
    walletStub.getAppKey.returns("aba2dd1a12eeafda3fda62aa6dfa21caaba2dd1a12eeafda3fda62aa6dfa21ca");
    const result = await getPublicKey(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.getAppKey).to.have.been.calledOnce;
    expect(walletStub.updatePluginState).to.have.been.calledOnce;
    expect(result).not.to.be.null;
  });
});
