import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {MetamaskState} from "../../../../src/interfaces";
import {WalletMock} from "../../crypto/wallet.mock.test";
import sinon from "sinon";
import axios from "axios";
import {getTransactions} from "../../../../src/rpc/substrate/getTransactions";

chai.use(sinonChai);

describe('Test rpc handler function: getTransactions', () => {

  const walletStub = new WalletMock();
  const axiosStub = sinon.stub(axios, "get");

  beforeEach(function () {
    walletStub.getPluginState.returns({polkadot: {account: {
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
    }}} as MetamaskState);
  });

  afterEach(function () {
    walletStub.reset();
    axiosStub.reset();
  });

  it('should return transactions history from api on successful request', async function () {
    axiosStub.resolves(Promise.resolve({data: {data: ["test-transaction"]}, status: 200}));
    const transactions = await getTransactions(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledTwice;
    expect(axios.get).to.have.been.calledOnce;
    expect(transactions).to.be.deep.eq(["test-transaction"]);
  });

  it('should return null from api on failed request', async function () {
    axiosStub.resolves(Promise.resolve({data: "", status: 500}));
    const transactions = await getTransactions(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledTwice;
    expect(axios.get).to.have.been.calledOnce;
    expect(transactions).to.be.eq(null);
  });
});
