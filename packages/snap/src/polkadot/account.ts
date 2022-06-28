import { Wallet } from "../interfaces";
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { stringToU8a } from "@polkadot/util";
import { getConfiguration } from "../configuration";
import { JsonBIP44CoinTypeNode } from "@metamask/key-tree";

const kusamaCoinType = 434;
const polkadotCoinType = 354;

/**
 * Returns KeyringPair if one is saved in wallet state, creates new one otherwise
 * @param wallet
 */
export async function getKeyPair(wallet: Wallet): Promise<KeyringPair> {

  const bip44Node = (await wallet.request({
    method: `snap_getBip44Entropy_${kusamaCoinType}`,
    params: [],
  })) as JsonBIP44CoinTypeNode;

  // generate keys
  const seed = bip44Node.key.slice(0, 32);
  const config = await getConfiguration(wallet);
  const ss58Format = config.addressPrefix;
  const keyring = new Keyring({ ss58Format });

  return keyring.addFromSeed(stringToU8a(seed))
}
