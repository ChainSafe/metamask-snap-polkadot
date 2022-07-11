import chai from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";
import * as api from "../../../../../src/polkadot/api";
import {WalletMock} from "../../../wallet.mock.test";

chai.use(sinonChai);

describe('Test balance subscription', function() {

  const walletStub = new WalletMock();
  const getApiStub = sinon.stub(api, "getApi");
  const testOrigin = "test-origin";

  afterEach(function() {
    walletStub.reset();
  });
});
