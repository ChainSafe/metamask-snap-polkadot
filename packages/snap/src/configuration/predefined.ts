import {SnapConfig} from "@chainsafe/metamask-polkadot-types";

export const kusamaConfiguration: SnapConfig = {
  addressPrefix: 2,
  networkName: "kusama",
  unit: {
    decimals: 12,
    image: "https://svgshare.com/i/L3o.svg",
    symbol: "KSM",
  },
  wsRpcUrl: "wss://kusama-rpc.polkadot.io/",
};
export const westendConfiguration: SnapConfig = {
  addressPrefix: 42,
  networkName: "westend",
  unit: {
    decimals: 12,
    image: "https://svgshare.com/i/L2d.svg",
    symbol: "WND",
  },
  wsRpcUrl: "wss://westend-rpc.polkadot.io/",
};

export const polkadotConfiguration: SnapConfig = {
  addressPrefix: 0,
  networkName: "polkadot",
  unit: {
    decimals: 12,
    image: "https://polkadot.js.org/apps/static/polkadot-circle.1eea41b2..svg",
    symbol: "DOT",
  },
  wsRpcUrl: "wss://rpc.polkadot.io/",
};

export const defaultConfiguration: SnapConfig = westendConfiguration;