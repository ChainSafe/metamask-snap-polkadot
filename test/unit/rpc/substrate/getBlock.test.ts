import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {WalletMock} from "../../crypto/wallet.mock.test";
import ApiPromise from "@polkadot/api/promise";
import sinon from "sinon";
import {getBlock} from "../../../../src/rpc/substrate/getBlock";
import { BlockHash } from '@polkadot/types/interfaces/rpc';
import { hexToU8a } from '@polkadot/util';

chai.use(sinonChai);

describe('Test rpc handler function: getBlock', () => {

  const walletStub = new WalletMock();

  afterEach(function () {
    walletStub.reset();
  });

  it('should return block on valid block id as parameter', async function () {
    // api stub
    const apiStub = {rpc: {chain: {getBlock: sinon.stub(), getBlockHash: sinon.stub()}}};
    apiStub.rpc.chain.getBlockHash.returns(
      hexToU8a("0xc9fb400866641ca80ef3e760d904fe15a8c9eda6ff1bd769b0628e26e82d5c75") as BlockHash
    );
    apiStub.rpc.chain.getBlock.returns({});
    const api = apiStub as unknown as ApiPromise;
    const result = await getBlock({blockId: 1}, api);
    expect(result).not.to.be.null;
    expect(apiStub.rpc.chain.getBlockHash).to.have.been.calledOnceWith(1);
    // eslint-disable-next-line max-len
    expect(apiStub.rpc.chain.getBlock).to.have.been.calledOnceWith(hexToU8a("0xc9fb400866641ca80ef3e760d904fe15a8c9eda6ff1bd769b0628e26e82d5c75") as BlockHash);
  });

  it('should return block on valid block hash as parameter', async function () {
    // api stub
    const apiStub = {rpc: {chain: {getBlock: sinon.stub()}}};
    apiStub.rpc.chain.getBlock.returns({});
    const api = apiStub as unknown as ApiPromise;
    const result = await getBlock({hash: "0xc9fb400866641ca80ef3e760d904fe15a8c9eda6ff1bd769b0628e26e82d5c75"}, api);
    expect(result).not.to.be.null;
    // eslint-disable-next-line max-len
    expect(apiStub.rpc.chain.getBlock).to.have.been.calledOnceWith("0xc9fb400866641ca80ef3e760d904fe15a8c9eda6ff1bd769b0628e26e82d5c75");
  });

  it('should return null on empty parameters object', async function () {
    const api = {} as unknown as ApiPromise;
    const result = await getBlock({}, api);
    expect(result).to.be.null;
  });

});
