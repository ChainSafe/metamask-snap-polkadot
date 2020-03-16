import {Wallet} from "./interfaces";
import {getPublicKey} from "./rpc/getPublicKey";

declare let wallet: Wallet;

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'getPublicKey':
      return await getPublicKey(wallet, requestObject);
    default:
      throw new Error('Method not found.');
  }
});