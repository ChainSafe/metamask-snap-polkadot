import {SnapConfig} from "./interfaces";

export const kusamaConfiguration: SnapConfig = {
  addressPrefix: 2,
  networkName: "kusama",
  unit: {
    assetId: "ksm-token",
    decimals: 12,
    image: "https://svgur.com/i/Jiy.svg",
    symbol: "KSM",
  },
  wsRpcUrl: "wss://kusama-rpc.polkadot.io/",
};
export const westendConfiguration: SnapConfig = {
  addressPrefix: 48,
  networkName: "westend",
  unit: {
    assetId: "wst-token",
    decimals: 12,
    image: "https://svgur.com/i/Jiy.svg",
    symbol: "WST",
  },
  wsRpcUrl: "wss://westend-rpc.polkadot.io/",
};

export const defaultConfiguration: SnapConfig = kusamaConfiguration;