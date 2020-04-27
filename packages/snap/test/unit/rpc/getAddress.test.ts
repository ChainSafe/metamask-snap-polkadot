import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {EmptyMetamaskState, MetamaskState} from "../../../src/interfaces";
import {WalletMock} from "../crypto/wallet.mock.test";
import {getAddress} from "../../../src/rpc/getAddress";

chai.use(sinonChai);

describe('Test rpc handler function: getAddress', function() {

  const walletStub = new WalletMock();

  afterEach(function() {
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
      }
    }}} as MetamaskState);
    const result = await getAddress(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledTwice;
    expect(result).to.be.eq("HFkgz6P1qh2526tS5x6NZkFrXZ9f1xbmYADUgVdai34wTgd");
  });

  it('should return address and create new keypair on empty state', async function () {
    walletStub.getPluginState.returns(EmptyMetamaskState());
    walletStub.getAppKey.returns("aba2dd1a12eeafda3fda62aa6dfa21ca2aa6dfaba13fda6a22ea2dd1eafda1ca");
    const result = await getAddress(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledThrice;
    expect(result).to.be.eq("HFkgz6P1qh2526tS5x6NZkFrXZ9f1xbmYADUgVdai34wTgd");
  });
});
