import {Wallet} from "./interfaces";
import {getPublicKey} from "./rpc/getPublicKey";
import {initApi} from "./polkadot/initApi";
import {exportSeed} from "./rpc/exportSeed";

declare let wallet: Wallet;

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'getPublicKey':
      return await getPublicKey(wallet);
    case 'substrate_getChainHead':
      const api = await initApi();
      const head = await api.rpc.chain.getFinalizedHead();
      return head.hash;
    case 'exportPrivateKey':
      return await exportSeed(wallet);
    default:
      throw new Error('Method not found.');
  }
});