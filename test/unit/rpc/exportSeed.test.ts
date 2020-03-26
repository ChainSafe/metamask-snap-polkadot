import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {MetamaskState, Wallet} from "../../../src/interfaces";
import {exportSeed} from "../../../src/rpc/exportSeed";
import {WalletMock} from "../crypto/wallet.mock.test";

chai.use(sinonChai);

describe('Test rpc handler function: exportSeed', () => {

  const walletStub = new WalletMock();

  beforeEach(function () {
    walletStub.getPluginState.returns({polkadot: {account: {
      keyring: {
        address: "5Gk92fkWPUg6KNHSfP93UcPFhwGurM9RKAKU62Dg6upaCfH7",
        // eslint-disable-next-line max-len
        encoded: "0x3053020101300506032b6570042204206162613264643161313265656166646133666461363261613664666132316361cf043e13d9228d8a931ce4cc58efbd1ad6c5e2f1932c3174eb150dfaf9165b73a123032100cf043e13d9228d8a931ce4cc58efbd1ad6c5e2f1932c3174eb150dfaf9165b73",
        encoding: {
          content: ["pkcs8", "ed25519"],
          type: "none",
          version: "2"
        },
        meta: {}
      }
    }}} as MetamaskState);
  });

  afterEach(function () {
    walletStub.reset();
  });

  it('should return seed on positive prompt confirmation and keyring saved in state', async function () {
    walletStub.send.returns(true);
    walletStub.getAppKey.returns("aba2dd1a12eeafda3fda62aa6dfa21ca2aa6dfaba13fda6a22ea2dd1eafda1ca");
    const result = await exportSeed(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.send).to.have.been.calledOnce;
    expect(walletStub.getAppKey).to.have.been.calledOnce;
    expect(result).to.be.eq("aba2dd1a12eeafda3fda62aa6dfa21ca");
  });

  it('should not return seed on negative prompt confirmation', async function () {
    walletStub.send.returns(false);
    const result = await exportSeed(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.send).to.have.been.calledOnce;
    expect(result).to.be.eq(null);
  });

  it('should not return seed on empty state', async function () {
    walletStub.getPluginState.returns(null);
    const result = await exportSeed(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.send).to.not.have.been.called;
    expect(result).to.be.eq(null);
  });

});
