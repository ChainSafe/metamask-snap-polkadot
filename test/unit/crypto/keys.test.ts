import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";
import {generateKeys} from "../../../src/crypto/keys";
import {WalletMock} from "./wallet.mock.test";
import { hexToU8a } from '@polkadot/util';
import {EmptyMetamaskState} from "../../../src/interfaces";

chai.use(sinonChai);

describe('Test crypto function: generateKeys', function() {

  const walletStub = new WalletMock();

  afterEach(function() {
    walletStub.reset();
  });

  it('should generate valid keypair from app key', async () => {
    // stubs
    const appKey = "aba2dd1a12eeafda3fda62aa6dfa21caaba2dd1a12eeafda3fda62aa6dfa21ca";
    const expectedAddress = "5Gk92fkWPUg6KNHSfP93UcPFhwGurM9RKAKU62Dg6upaCfH7";
    const expectedPublicKey = "0xcf043e13d9228d8a931ce4cc58efbd1ad6c5e2f1932c3174eb150dfaf9165b73";
    walletStub.getAppKey.returns(appKey);
    walletStub.getPluginState.returns(EmptyMetamaskState());
    // tested method
    const result = await generateKeys(walletStub);
    // assertions
    expect(walletStub.getAppKey).to.have.been.calledOnce;
    expect(result).to.not.be.null;
    expect(result.address).to.be.eq(expectedAddress);
    expect(result.publicKey).to.deep.eq(hexToU8a(expectedPublicKey));
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.updatePluginState).to.have.been.calledOnce;
    expect(walletStub.updatePluginState).to.have.been.calledWithMatch({
      polkadot: {
        account: {keyring: sinon.match.any}
      }
    });
  });

  it('should throw error if app key too short', async function () {
    walletStub.getAppKey.returns("aba");
    try {
      await generateKeys(walletStub);
    } catch (e) {
      expect(e).to.exist;
    }
  });
});