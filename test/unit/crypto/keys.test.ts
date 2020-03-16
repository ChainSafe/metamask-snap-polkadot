import chai, { expect } from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";
import {generateKeys} from "../../../src/crypto/keys";
import {InvalidSeedError} from "../../../src/crypto/error";
import {WalletMock} from "./wallet.mock.test";
import {MetamaskState} from "../../../src/interfaces";

chai.use(sinonChai);

describe('generateKeys', () => {

  const sandbox = sinon.createSandbox();
  const wallet = new WalletMock();

  afterEach(function () {
    sandbox.restore();
  });

  it('should generate valid keypair from app key', async () => {
    // stubs
    wallet.getAppKey.returns("abasddsa12ssavdasfdas2easdfa21sa");
    // tested method
    const result = await generateKeys(wallet);
    // assertions
    expect(wallet.getAppKey).to.have.been.calledOnce;
    expect(wallet.updatePluginState).to.have.been.calledOnceWith({polkadot: {account: {
      publicKey: new Uint8Array([
        246, 206, 111, 196, 81, 241, 48, 25, 1, 101, 68, 184, 62, 78, 13, 80,
        13, 34, 253, 79, 101, 134, 97, 91, 80, 55, 24, 1, 48, 242, 19, 218
      ]),
      secretKey: new Uint8Array([
        97, 98, 97, 115, 100, 100, 115, 97, 49, 50, 115, 115, 97, 118, 100,
        97, 115, 102, 100, 97, 115, 50, 101, 97, 115, 100, 102, 97, 50, 49,
        115, 97, 246, 206, 111, 196, 81, 241, 48, 25, 1, 101, 68, 184, 62, 78,
        13, 80, 13, 34, 253, 79, 101, 134, 97, 91, 80, 55, 24, 1, 48, 242, 19, 218
      ]),
    }}} as MetamaskState);
    expect(result.publicKey).to.exist;
    expect(result.secretKey).to.exist;
    expect(result.publicKey.length).to.eq(32);
    expect(result.secretKey.length).to.eq(64);
  });

  it('should throw error if app key too short', async function () {
    wallet.getAppKey.returns("aba");
    try {
      await generateKeys(wallet);
    } catch (e) {
      expect(e.message).to.be.eq(InvalidSeedError.INVALID_SEED_MESSAGE);
    }
  });
});