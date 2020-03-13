import nacl from "tweetnacl";
import {KeyPairState} from "./interfaces";

function convertStringTo8UintArray(string: string): Uint8Array {
  const u8a = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    u8a[i] = string.charCodeAt(i);
  }
  return u8a;
}

// Generates nacl public/private keypair from seed
export function generateKeyPairFromSeed(seedString: string): KeyPairState {
  const seed = convertStringTo8UintArray(seedString.substr(0, 32));
  return nacl.sign.keyPair.fromSeed(seed);
}

