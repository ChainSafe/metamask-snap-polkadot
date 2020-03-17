
export function fromHexString(string: string): Uint8Array {
  let s = string;
  // clear prefix
  if (string.startsWith("0x")) {
    s = string.slice(2);
  }
  // check string length
  if (s.length % 2 !== 0) {
    throw new Error("Invalid hex string, length not even number.");
  }
  if (!s.match(/^[0-9A-Fa-f]+$/)) {
    throw new Error("Invalid characters in hex string.");
  }
  // convert
  const u8a = new Uint8Array(s.length / 2);
  for (let i = 0, k = 0; i < s.length; i+=2, k++) {
    u8a[k] = parseInt(s.substr(i, 2), 16);
  }
  return u8a;
}

// define byte to hex mapping
const byteToHex: string[] = [];
for (let n = 0; n <= 0xff; ++n) {
  const hexOctet = String("00" + n.toString(16)).slice(-2);
  byteToHex.push(hexOctet);
}

export function toHexString(uint8Array: Uint8Array): string {
  const buff = new Uint8Array(uint8Array);
  const hexOctets = new Array(buff.length);
  for (let i = 0; i < buff.length; ++i)
    hexOctets[i] = byteToHex[buff[i]];
  return "0x" + hexOctets.join("");
}

