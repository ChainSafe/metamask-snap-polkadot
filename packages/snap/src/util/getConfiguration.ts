import type { SnapConfig } from '@chainsafe/metamask-polkadot-types';
import { defaultConfiguration } from '@chainsafe/metamask-polkadot-config';
import { getMetamaskState } from '../rpc/getMetamaskState';

export async function getConfiguration(): Promise<SnapConfig> {
  const state = await getMetamaskState();

  if (!state || !state.config) {
    return defaultConfiguration;
  }
  return JSON.parse(<string>state.config) as SnapConfig;
}
