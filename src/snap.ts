import {Wallet} from "./interfaces";
import {generateKeyPairFromSeed} from "./util";

declare let wallet: Wallet;

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'generateKeys':
      const appKey = await wallet.getAppKey();
      const keypair = generateKeyPairFromSeed(appKey);
      wallet.updatePluginState({polkadot: {account: keypair}});
      // temp: show keypair is saved
      console.log(wallet.getPluginState());
      wallet.send({
        method: 'alert',
        params: [
          `Hello, ${originString} from NodeFactory1! state:` +
          `Created keyring pair public: ${keypair.publicKey} and private: ${keypair.secretKey} `
        ]
      });
      return keypair;
    case 'getPublicKey':
      const keyPairState = wallet.getPluginState();
      if (keyPairState != null && keyPairState.polkadot.account != null) {
        return keyPairState.polkadot.account.publicKey;
      } else {
        return null;
      }
    default:
      throw new Error('Method not found.');
  }
});