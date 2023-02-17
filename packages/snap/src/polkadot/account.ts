import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { stringToU8a } from "@polkadot/util";
import { getConfiguration } from "../configuration";
import { JsonBIP44CoinTypeNode } from "@metamask/key-tree";
import { SnapNetworks } from "@chainsafe/metamask-polkadot-types";
import { SnapsGlobalObject } from '@metamask/snaps-types';

/**
 * Returns KeyringPair if one is saved in wallet state, creates new one otherwise
 * @param wallet
 */
export async function getKeyPair(snap: SnapsGlobalObject): Promise<KeyringPair> {
  const config = await getConfiguration(snap);

  const bip44Node = (await snap.request({
    method: "snap_getBip44Entropy",
    params: {
      coinType: getCoinTypeByNetwork(config.networkName)
    },
  })) as JsonBIP44CoinTypeNode;

  // generate keys
  const seed = bip44Node.privateKey.slice(0, 32);
  const ss58Format = config.addressPrefix;
  const keyring = new Keyring({ ss58Format });

  return keyring.addFromSeed(stringToU8a(seed));
}

const getCoinTypeByNetwork = (network: SnapNetworks): number => {
  switch (network) {
    case "kusama":
    case "westend":
      return 434;
    case "polkadot":
      return 354;
  }
};
