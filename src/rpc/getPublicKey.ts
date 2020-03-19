import {Wallet} from "../interfaces";
import {generateKeys} from "../crypto/keys";
import {toHexString} from "../util/hex";
import {ApiPromise, WsProvider} from "@polkadot/api";

export async function getPublicKey(wallet: Wallet): Promise<string> {
  // Construct
  const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/', true);
  console.log(wsProvider);
  const api = await ApiPromise.create({ provider: wsProvider });

  // Do something
  console.log(api.genesisHash.toHex());


  const keyPairState = wallet.getPluginState();
  if (keyPairState != null) {
    // keypair already saved
    const pk = keyPairState.polkadot.account.publicKey;
    return toHexString(pk);
  } else {
    // generate new keypair
    const keypair = await generateKeys(wallet);
    return toHexString(keypair.publicKey);
  }
}
