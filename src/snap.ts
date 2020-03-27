import {Wallet} from "./interfaces";
import {getPublicKey} from "./rpc/getPublicKey";
import {initApi} from "./polkadot/initApi";
import {exportSeed} from "./rpc/exportSeed";
import {getBalance} from "./rpc/substrate/getBalance";
import {getAddress} from "./rpc/getAddress";
import ApiPromise from "@polkadot/api/promise";
import {getTransactions} from "./rpc/substrate/getTransactions";

declare let wallet: Wallet;

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  // init api if substrate method called
  let api: ApiPromise = null;
  if (requestObject.method.startsWith("substrate")) {
    api = await initApi();
  }
  switch (requestObject.method) {
    case 'getPublicKey':
      return await getPublicKey(wallet);
    case 'getAddress':
      return await getAddress(wallet);
    case 'exportSeed':
      return await exportSeed(wallet);
    case 'getAllTransactions':
      return await getTransactions(wallet);
    case 'substrate_getBalance':
      return await getBalance(wallet, api);
    case 'substrate_getChainHead':
      // temporary method
      const head = await api.rpc.chain.getFinalizedHead();
      return head.hash;
    default:
      throw new Error('Method not found.');
  }
});