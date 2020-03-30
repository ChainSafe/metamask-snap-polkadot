import {Wallet} from "./interfaces";
import {getPublicKey} from "./rpc/getPublicKey";
import {initApi} from "./polkadot/initApi";
import {exportSeed} from "./rpc/exportSeed";
import {getBalance} from "./rpc/substrate/getBalance";
import {getAddress} from "./rpc/getAddress";
import ApiPromise from "@polkadot/api/promise";
import {getTransactions} from "./rpc/substrate/getTransactions";
import {getBlock} from "./rpc/substrate/getBlock";
import {manageUnitAsset} from "./asset/unit";

declare let wallet: Wallet;

const apiDependentMethods = ["getBlock", "getBalance", "getChainHead", "getPublicKey"];

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  // init api if needed
  let api: ApiPromise = null;
  if (apiDependentMethods.includes(requestObject.method)) {
    api = await initApi();
  }
  switch (requestObject.method) {
    case 'getPublicKey':
      await manageUnitAsset(wallet, api, "add");
      return await getPublicKey(wallet);
    case 'getAddress':
      return await getAddress(wallet);
    case 'exportSeed':
      return await exportSeed(wallet);
    case 'getAllTransactions':
      return await getTransactions(wallet);
    case 'getBlock':
      return await getBlock(requestObject.params, api);
    case 'getBalance':
      await manageUnitAsset(wallet, api, "update"); // just for showcase
      return await getBalance(wallet, api);
    case 'getChainHead':
      // temporary method
      const head = await api.rpc.chain.getFinalizedHead();
      return head.hash;
    default:
      throw new Error('Method not found.');
  }
});