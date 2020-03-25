import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";
import {generateKeys} from "../../../src/crypto/keys";
import {WalletMock} from "./wallet.mock.test";
import {MetamaskState} from "../../../src/interfaces";

chai.use(sinonChai);

describe('Test crypto function: generateKeys', () => {

  const sandbox = sinon.createSandbox();
  const wallet = new WalletMock();

  afterEach(function () {
    sandbox.restore();
  });

  it('should generate valid keypair from app key', async () => {
    // stubs
    wallet.getAppKey.returns("aba2dd1a12eeafda3fda62aa6dfa21caaba2dd1a12eeafda3fda62aa6dfa21ca");
    // tested method
    const result = await generateKeys(wallet);
    // assertions
    expect(wallet.getAppKey).to.have.been.calledOnce;
    expect(wallet.updatePluginState).to.have.been.calledOnceWith({
      polkadot: {
        account: {
          publicKey: new Uint8Array([
            128, 151, 5, 28, 80, 2, 116, 236, 200, 124, 162,
            118, 71, 202, 126, 119, 21, 244, 105, 77, 144, 36,
            121, 161, 158, 227, 112, 40, 234, 240, 188, 104
          ]),
          secretKey: new Uint8Array([
            171, 162, 221, 26, 18, 238, 175, 218, 63, 218, 98,
            170, 109, 250, 33, 202, 171, 162, 221, 26, 18, 238,
            175, 218, 63, 218, 98, 170, 109, 250, 33, 202, 128,
            151, 5, 28, 80, 2, 116, 236, 200, 124, 162, 118, 71,
            202, 126, 119, 21, 244, 105, 77, 144, 36, 121, 161,
            158, 227, 112, 40, 234, 240, 188, 104
          ]),
        },
        metadata: ""
      }
    } as MetamaskState);
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
      expect(e).to.exist;
    }
  });
});