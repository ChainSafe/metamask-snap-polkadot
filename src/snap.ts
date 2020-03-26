import {Wallet} from "./interfaces";
import {getPublicKey} from "./rpc/getPublicKey";
import {initApi} from "./polkadot/initApi";
import {exportSeed} from "./rpc/exportSeed";
import {getBalance} from "./rpc/substrate/getBalance";
import {getAddress} from "./rpc/getAddress";

declare let wallet: Wallet;

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'getPublicKey':
      return await getPublicKey(wallet);
    case 'getAddress':
      return await getAddress(wallet);
    case 'exportSeed':
      return await exportSeed(wallet);
    case 'substrate_getChainHead':
      const api = await initApi();
      const head = await api.rpc.chain.getFinalizedHead();
      return head.hash;
    case 'substrate_getBalance':
      return await getBalance(wallet);
    default:
      throw new Error('Method not found.');
  }
});