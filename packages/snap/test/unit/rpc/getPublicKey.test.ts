import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {getPublicKey} from "../../../src/rpc/getPublicKey";
import {WalletMock} from "../wallet.mock.test";
import {testAppKey, testPublicKey} from "./keyPairTestConstants";
import {EmptyMetamaskState} from "../../../src/interfaces";

chai.use(sinonChai);

describe('Test rpc handler function: getPublicKey', function() {

  const walletStub = new WalletMock();

  afterEach(function () {
    walletStub.reset();
  });

  it('should return pk', async function () {
    walletStub.request.onFirstCall().returns({key: testAppKey});
    walletStub.request.onSecondCall().returns(EmptyMetamaskState());
    const result = await getPublicKey(walletStub);
    expect(result).to.be.eq(testPublicKey);
  });
});
