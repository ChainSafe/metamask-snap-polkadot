import nacl from "tweetnacl";

function convert(string: string): Uint8Array {
  const u8a = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    u8a[i] = string.charCodeAt(i);
  }
  return u8a;
}

export type KeyPair = { secretKey: Uint8Array; publicKey: Uint8Array };

export function getKeysFromSeed(seedString: string): KeyPair {
  const seed = convert(seedString);
  return nacl.sign.keyPair.fromSeed(seed);
}

