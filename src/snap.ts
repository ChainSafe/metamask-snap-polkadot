import {Wallet} from "./interfaces";
import {getPublicKey} from "./rpc/getPublicKey";
import {exportPrivateKey} from "./rpc/exportPrivateKey";

declare let wallet: Wallet;

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'getPublicKey':
      return await getPublicKey(wallet);
    case 'exportPrivateKey':
      return await exportPrivateKey(wallet);
    default:
      throw new Error('Method not found.');
  }
});