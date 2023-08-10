import deepmerge from 'deepmerge';
import { getDefaultConfiguration } from '../configuration';
import { SnapConfig } from '@chainsafe/metamask-polkadot-types';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { getMetamaskState } from './getMetamaskState';

export async function configure(
  snap: SnapsGlobalObject,
  networkName: string,
  overrides: unknown
): Promise<SnapConfig> {
  const defaultConfig = getDefaultConfiguration(networkName) as SnapConfig;
  const configuration = deepmerge(defaultConfig, overrides) as SnapConfig;

  const state = await getMetamaskState();
  console.log('state', state);
  await snap.request({
    method: 'snap_manageState',
    params: {
      newState: { ...state, config: JSON.stringify(configuration) },
      operation: 'update'
    }
  });

  return configuration;
}
