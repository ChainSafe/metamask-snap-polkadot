import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import ApiPromise from "@polkadot/api/promise";
import sinon from "sinon";
import {registerOnBalanceChange, removeOnBalanceChange} from "../../../../../src/polkadot/events/balance";
import * as api from "../../../../../src/polkadot/api";
import {WalletMock} from "../../../crypto/wallet.mock.test";
import { MetamaskState } from "../../../../../src/interfaces";

chai.use(sinonChai);

describe('Test balance subscription', function() {

  const walletStub = new WalletMock();
  const getApiStub = sinon.stub(api, "getApi");
  const testOrigin = "test-origin";

  afterEach(function() {
    walletStub.reset();
  });

  it('should call unsubscribe function for provided origin', async function () {
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
    // unsubscribe stub
    const unsubscribeStub = sinon.stub();
    // api stub
    const apiStub = {query: {system: {account: sinon.stub()}}};
    apiStub.query.system.account.returns(unsubscribeStub);
    const api = apiStub as unknown as ApiPromise;
    getApiStub.returns(Promise.resolve(api));
    // call tested function
    await registerOnBalanceChange(walletStub, testOrigin);
    expect(apiStub.query.system.account).to.be.calledOnceWith(
      "5Gk92fkWPUg6KNHSfP93UcPFhwGurM9RKAKU62Dg6upaCfH7", sinon.match.any
    );
    await removeOnBalanceChange(testOrigin);
    expect(unsubscribeStub).to.have.been.calledOnce;
  });

});
