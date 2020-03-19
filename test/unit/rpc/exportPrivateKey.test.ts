import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {MetamaskState, Wallet} from "../../../src/interfaces";
import {exportPrivateKey} from "../../../src/rpc/exportPrivateKey";
import {WalletMock} from "../crypto/wallet.mock.test";

chai.use(sinonChai);

describe('Test rpc handler function: exportPrivateKey', () => {

  const walletStub = new WalletMock();

  beforeEach(function () {
    walletStub.getPluginState.returns({polkadot: {account: {
      publicKey: Uint8Array.from([1, 2, 3, 4]),
      secretKey: Uint8Array.from([1, 2, 3]),
    }}} as MetamaskState);
  });

  afterEach(function () {
    walletStub.reset();
  });

  it('should return private key on positive prompt confirmation', async function () {
    walletStub.send.returns({result: true});
    const result = await exportPrivateKey(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.send).to.have.been.calledOnce;
    expect(result).to.be.eq("0x010203");
  });

  it('should not return private key on negative prompt confirmation', async function () {
    walletStub.send.returns({result: false});
    const result = await exportPrivateKey(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.send).to.have.been.calledOnce;
    expect(result).to.be.eq(null);
  });

});
