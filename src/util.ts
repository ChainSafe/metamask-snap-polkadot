
export function convertStringTo8UintArray(string: string): Uint8Array {
  const u8a = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    u8a[i] = string.charCodeAt(i);
  }
  return u8a;
}

// define byte to hex mapping
const byteToHex: string[] = [];
for (let n = 0; n <= 0xff; ++n) {
  const hexOctet = String("00" + n.toString(16)).slice(-2);
  byteToHex.push(hexOctet);
}

export function iterableToHexString(arrayBuffer: Iterable<number>): string {
  const buff = new Uint8Array(arrayBuffer);
  const hexOctets = new Array(buff.length);

  for (let i = 0; i < buff.length; ++i)
    hexOctets[i] = byteToHex[buff[i]];

  return hexOctets.join("");
}

