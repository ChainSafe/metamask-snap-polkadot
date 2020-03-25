import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";
import {generateKeys} from "../../../src/crypto/keys";
import {WalletMock} from "./wallet.mock.test";

chai.use(sinonChai);

describe('Test crypto function: generateKeys', () => {

  const sandbox = sinon.createSandbox();
  const wallet = new WalletMock();

  afterEach(function () {
    sandbox.restore();
  });

  it('should generate valid keypair from app key', async () => {
    // stubs
    const appKey = "aba2dd1a12eeafda3fda62aa6dfa21caaba2dd1a12eeafda3fda62aa6dfa21ca";
    const expectedAddress = "5Gk92fkWPUg6KNHSfP93UcPFhwGurM9RKAKU62Dg6upaCfH7";
    wallet.getAppKey.returns(appKey);
    // tested method
    const result = await generateKeys(wallet);
    // assertions
    expect(wallet.getAppKey).to.have.been.calledOnce;
    expect(result).to.not.be.null;
    expect(result.address).to.be.eq(expectedAddress);
    // expect(result.publicKey).to.be.eq();
    expect(wallet.updatePluginState).to.have.been.calledOnce;
    expect(wallet.updatePluginState).to.have.been.calledWithMatch({
      polkadot: {
        account: {keyring: sinon.match.any, seed: appKey.substr(0, 32)}
      }
    });
  });

  it('should throw error if app key too short', async function () {
    wallet.getAppKey.returns("aba");
    try {
      await generateKeys(wallet);
    } catch (e) {
      expect(e).to.exist;
    }
  });
});