import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {MetamaskState} from "../../../src/interfaces";
import {exportSeed} from "../../../src/rpc/exportSeed";
import {WalletMock} from "../crypto/wallet.mock.test";
import {getAddress} from "../../../src/rpc/getAddress";

chai.use(sinonChai);

describe('Test rpc handler function: getAddress', () => {

  const walletStub = new WalletMock();

  afterEach(function () {
    walletStub.reset();
  });

  it('should return address on saved keyring in state', async function () {
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
      },
      seed: "aba2dd1a12eeafda3fda62aa6dfa21ca",
    }}} as MetamaskState);
    const result = await getAddress(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(result).to.be.eq("5Gk92fkWPUg6KNHSfP93UcPFhwGurM9RKAKU62Dg6upaCfH7");
  });

  it('should not return address on empty state', async function () {
    walletStub.getPluginState.returns(null);
    const result = await exportSeed(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(result).to.be.eq(null);
  });

});
