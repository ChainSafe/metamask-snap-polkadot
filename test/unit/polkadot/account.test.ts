import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {EmptyMetamaskState, MetamaskState} from "../../../src/interfaces";
import {WalletMock} from "../crypto/wallet.mock.test";
import {getKeyPair} from "../../../src/polkadot/account";
import {hexToU8a} from '@polkadot/util';

chai.use(sinonChai);

describe('Test account function: getKeyPair', function() {

  const walletStub = new WalletMock();

  afterEach(function() {
    walletStub.reset();
  });

  it('should return keypair on saved keypair in state', async function() {
    // wallet stub
    walletStub.getPluginState.returns({
      polkadot: {
        account: {
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
        }
      }
    } as MetamaskState);
    const result = await getKeyPair(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(result.address).to.be.eq("5Gk92fkWPUg6KNHSfP93UcPFhwGurM9RKAKU62Dg6upaCfH7");
    // eslint-disable-next-line max-len
    expect(result.publicKey).to.be.deep.eq(hexToU8a("0xcf043e13d9228d8a931ce4cc58efbd1ad6c5e2f1932c3174eb150dfaf9165b73"));
  });

  it('should create new and return keypair on empty state', async function() {
    walletStub.getPluginState.returns(EmptyMetamaskState());
    walletStub.getAppKey.returns("aba2dd1a12eeafda3fda62aa6dfa21ca2aa6dfaba13fda6a22ea2dd1eafda1ca");
    walletStub.updatePluginState.returnsArg(0);
    const result = await getKeyPair(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledTwice;
    expect(walletStub.updatePluginState).to.have.been.calledOnce;
    expect(walletStub.getAppKey).to.have.been.calledOnce;
    expect(result.address).to.be.eq("5Gk92fkWPUg6KNHSfP93UcPFhwGurM9RKAKU62Dg6upaCfH7");
    // eslint-disable-next-line max-len
    expect(result.publicKey).to.be.deep.eq(hexToU8a("0xcf043e13d9228d8a931ce4cc58efbd1ad6c5e2f1932c3174eb150dfaf9165b73"));
  });
});
