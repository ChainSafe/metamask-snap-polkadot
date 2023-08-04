import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {WalletMock} from "../wallet.mock.test";
import {showConfirmationDialog} from "../../../src/util/confirmation";

chai.use(sinonChai);

describe('Test showConfirmationDialog', function() {
  const walletStub = new WalletMock();

  afterEach(() => {
    walletStub.reset();
  });

  it('should return true on positive confirmation', async function () {
    await showConfirmationDialog(walletStub, { prompt: "confirmation" });
    expect(walletStub.request).to.have.been.calledOnceWith(
      { method: 'snap_dialog', params: [{ prompt: "confirmation" }] }
    );
  });

  it('should return false on negative confirmation', async function () {
    await showConfirmationDialog(walletStub, { prompt: "confirmation" });
    expect(walletStub.request).to.have.been.calledOnceWith(
      { method: 'snap_dialog', params: [{ prompt: "confirmation" }] }
    );
  });
});
