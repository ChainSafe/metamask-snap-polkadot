import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {MetamaskState} from "../../../../src/interfaces";
import {WalletMock} from "../../crypto/wallet.mock.test";
import {getBalance} from "../../../../src/rpc/substrate/getBalance";
import ApiPromise from "@polkadot/api/promise";
import { AccountInfo } from "@polkadot/types/interfaces/system";
import sinon from "sinon";

chai.use(sinonChai);

describe('Test rpc handler function: getBalance', function() {

  const walletStub = new WalletMock();

  afterEach(function() {
    walletStub.reset();
  });

  it('should return balance on saved keyring in state', async function () {
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
    // api stub
    const apiStub = {query: {system: {account: sinon.stub()}}};
    apiStub.query.system.account.returns({data: {free: '0'}} as unknown as AccountInfo);
    const api = apiStub as unknown as ApiPromise;
    const result = await getBalance(walletStub, api);
    expect(result).to.be.eq("0");
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    // eslint-disable-next-line max-len
    expect(apiStub.query.system.account).to.have.been.calledOnceWith("5Gk92fkWPUg6KNHSfP93UcPFhwGurM9RKAKU62Dg6upaCfH7");
  });

  it('should not return balance on empty state', async function () {
    walletStub.getPluginState.returns({polkadot: {account: null, config: null}});
    walletStub.getAppKey.returns("aba2dd1a12eeafda3fda62aa6dfa21ca2aa6dfaba13fda6a22ea2dd1eafda1ca");
    // api stub
    const apiStub = {query: {system: {account: sinon.stub()}}};
    apiStub.query.system.account.returns({data: {free: "0"}} as unknown as AccountInfo);
    const api = apiStub as unknown as ApiPromise;
    const result = await getBalance(walletStub, api);
    expect(result).to.be.eq("0");
    expect(walletStub.getPluginState).to.have.been.calledTwice;
    // eslint-disable-next-line max-len
    expect(apiStub.query.system.account).to.have.been.calledOnceWith("5Gk92fkWPUg6KNHSfP93UcPFhwGurM9RKAKU62Dg6upaCfH7");
  });

});
