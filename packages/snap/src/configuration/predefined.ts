import type { SnapConfig } from '@chainsafe/metamask-polkadot-types';

export const kusamaConfiguration: SnapConfig = {
  addressPrefix: 2,
  networkName: 'kusama',
  unit: {
    decimals: 12,
    image: 'https://svgshare.com/i/L3o.svg',
    symbol: 'KSM'
  },
  wsRpcUrl: 'https://kusama-rpc.polkadot.io/'
};

export const westendConfiguration: SnapConfig = {
  addressPrefix: 42,
  networkName: 'westend',
  unit: {
    decimals: 12,
    image: 'https://svgshare.com/i/L2d.svg',
    symbol: 'WND'
  },
  wsRpcUrl: 'https://westend-rpc.polkadot.io/'
};

export const polkadotConfiguration: SnapConfig = {
  addressPrefix: 0,
  networkName: 'polkadot',
  unit: {
    decimals: 12,
    image: 'https://polkadot.js.org/apps/static/polkadot-circle.1eea41b2..svg',
    symbol: 'DOT'
  },
  wsRpcUrl: 'https://rpc.polkadot.io/'
};

export const defaultConfiguration: SnapConfig = westendConfiguration;
