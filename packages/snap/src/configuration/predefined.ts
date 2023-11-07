import type { SnapConfig } from '@subspace/metamask-subspace-types';

export const gemini3gConfiguration: SnapConfig = {
  addressPrefix: 2,
  networkName: 'gemini-3g',
  unit: {
    decimals: 12,
    image: 'https://svgshare.com/i/L3o.svg',
    symbol: 'tSSC'
  },
  wsRpcUrl: 'https://rpc-0.gemini-3g.subspace.network/ws/'
};

export const gemini3fConfiguration: SnapConfig = {
  addressPrefix: 42,
  networkName: 'gemini-3f',
  unit: {
    decimals: 12,
    image: 'https://svgshare.com/i/L2d.svg',
    symbol: 'tSSC'
  },
  wsRpcUrl: 'https://rpc-0.gemini-3f.subspace.network/ws/'
};

export const devNetConfiguration: SnapConfig = {
  addressPrefix: 0,
  networkName: 'devNet',
  unit: {
    decimals: 12,
    image: 'https://polkadot.js.org/apps/static/polkadot-circle.1eea41b2..svg',
    symbol: 'tSSC'
  },
  wsRpcUrl: 'https://rpc-0.devnet.subspace.network/ws/'
};

export const defaultConfiguration: SnapConfig = gemini3gConfiguration;
