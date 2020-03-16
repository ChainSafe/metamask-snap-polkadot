import chai, { expect } from "chai";
import sinonChai from "sinon-chai";
import {Wallet} from "../../../src/interfaces";
import sinon from "sinon";
import {generateKeys} from "../../../src/crypto/keys";
import {InvalidSeedError} from "../../../src/crypto/error";

chai.use(sinonChai);

describe('generateKeys', () => {

  const sandbox = sinon.createSandbox();
  const walletStub = {} as Wallet;

  afterEach(function () {
    sandbox.restore();
  });

  it('should generate valid keypair from app key', async () => {
    // stubs
    walletStub.getAppKey = sandbox.stub().returns("abasddsa12ssavdasfdas2easdfa21sa");
    walletStub.updatePluginState = sandbox.stub();
    // tested method
    const result = await generateKeys(walletStub);
    // assertions
    expect(walletStub.getAppKey).to.have.been.calledOnce;
    expect(walletStub.updatePluginState).to.have.been.calledOnce;
    expect(result.publicKey).to.exist;
    expect(result.secretKey).to.exist;
    expect(result.publicKey.length).to.eq(32);
    expect(result.secretKey.length).to.eq(64);
  });

  it('should throw error if app key too short', async function () {
    walletStub.getAppKey = sandbox.stub().returns("aba");
    try {
      await generateKeys(walletStub);
    } catch (e) {
      expect(e.message).to.be.eq(InvalidSeedError.INVALID_SEED_MESSAGE);
    }
  });
});