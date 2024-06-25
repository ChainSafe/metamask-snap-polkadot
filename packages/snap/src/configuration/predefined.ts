import type { SnapConfig } from '@chainsafe/metamask-polkadot-types';

export const kusamaConfiguration: SnapConfig = {
  addressPrefix: 2,
  networkName: 'kusama',
  genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
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
  genesisHash: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
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
  genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
  unit: {
    decimals: 12,
    image: 'https://polkadot.js.org/apps/static/polkadot-circle.1eea41b2..svg',
    symbol: 'DOT'
  },
  wsRpcUrl: 'https://rpc.polkadot.io/'
};

export const defaultConfiguration: SnapConfig = westendConfiguration;
