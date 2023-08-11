import { getKeyPair } from '../polkadot/account';

export async function getAddress(): Promise<string> {
  const keyPair = await getKeyPair();
  return keyPair.address;
}
