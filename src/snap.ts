import {Wallet} from "./interfaces";
import {getKeysFromSeed, KeyPair} from "./util";

declare let wallet: Wallet;

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'hello':
      const appKey = await wallet.getAppKey();
      const keypair = getKeysFromSeed(appKey);
      wallet.updatePluginState(keypair);
      // to show keypair is saved
      console.log(wallet.getPluginState());
      return wallet.send({
        method: 'alert',
        params: [
          `Hello, ${originString} from NodeFactory1! state:` +
          `Created keyring pair public: ${keypair.publicKey} and private: ${keypair.secretKey} `
        ]
      });
    default:
      throw new Error('Method not found.');
  }
});