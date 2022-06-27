import {MetamaskState, Wallet} from "../interfaces";
import deepmerge from "deepmerge";
import {getDefaultConfiguration} from "../configuration";
import {SnapConfig} from "@chainsafe/metamask-polkadot-types";

export async function configure(wallet: Wallet, networkName: string, overrides: unknown): Promise<SnapConfig> {
  const defaultConfig = getDefaultConfiguration(networkName);
  const configuration = deepmerge(defaultConfig, overrides);
  const state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  }) as MetamaskState;
  state.polkadot.config = configuration;
  wallet.request({
    method: 'snap_manageState',
    params: ['update', state],
  });

  return configuration;
}