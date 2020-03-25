import {KeyPairState, Wallet} from "../interfaces";
import {fromHexString} from "../util/hex";
import nacl from "tweetnacl";

// Generates ed25519 public/private keypair from seed
function generateKeyPairFromSeed(seedString: string): KeyPairState {
  if (seedString.length < 32) { throw new Error("Invalid seed string."); }
  const seed = fromHexString(seedString.substr(0, 64));
  return nacl.sign.keyPair.fromSeed(seed);
}

// Generate keypair from metamask wallet interface using app key
export async function generateKeys(wallet: Wallet): Promise<KeyPairState> {
  const appKey = await wallet.getAppKey();
  const keypair = generateKeyPairFromSeed(appKey);
  try {
    wallet.updatePluginState({polkadot: {account: keypair}});
  } catch (e) {
    console.error("Failed to store generated polkadot account", keypair, e);
  }
  return keypair;
}

