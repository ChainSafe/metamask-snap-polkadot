import {Wallet} from "./interfaces";
import nacl from 'tweetnacl';

declare let wallet: Wallet;

// function convert(string: string): Uint8Array {
//   const u8a = new Uint8Array(string.length);
//   for (let i = 0; i < string.length; i++) {
//     u8a[i] = string.charCodeAt(i);
//   }
//   return u8a;
// }
//
// type KeyPair = { secretKey: Uint8Array; publicKey: Uint8Array };
//
// function getKeysFromSeed(seedString: string): KeyPair {
//   const seed = convert(seedString);
//   return nacl.sign.keyPair.fromSeed(seed);
// }

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'hello':
      const t = await wallet.getAppKey();
      const APP_SEED = (t + Array(32).join(' ')).substring(0, 32);
      // const keypair = getKeysFromSeed(APP_SEED);
      return wallet.send({
        method: 'alert',
        params: [
          `Hello, ${originString} from NodeFactory1!` +
          `Created keyring pair for ${t} with ` // pk: ${keypair.publicKey} and sk: ${keypair.secretKey}
        ]
      });
    default:
      throw new Error('Method not found.');
  }
});