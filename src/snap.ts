import {Wallet} from "./interfaces";
import {getPublicKey} from "./rpc/getPublicKey";
import {exportPrivateKey} from "./rpc/exportPrivateKey";
import {connectToNode} from "./rpc/connectToNode";
import {initApi} from "./polkadot/initApi";

declare let wallet: Wallet;

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'getPublicKey':
      return await getPublicKey(wallet);
    case 'substrate_connect':
      return await connectToNode(wallet);
    case 'substrate_getChainHead':
      const api = await initApi(wallet);
      const head = await api.rpc.chain.getFinalizedHead();
      return head.hash;
      return true;
    case 'exportPrivateKey':
      return await exportPrivateKey(wallet);
    default:
      throw new Error('Method not found.');
  }
});