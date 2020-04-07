import {SnapConfigState} from "../interfaces";

export const kusamaConfiguration: SnapConfigState = {
  network: {
    addressPrefix: 2,
    wsRpcUrl: "wss://kusama-rpc.polkadot.io/",
  },
  unit: {
    image: "https://svgur.com/i/Jiy.svg",
    symbol: "KSM",
  },
};
export const westendConfiguration: SnapConfigState = {
  network: {
    addressPrefix: 48,
    wsRpcUrl: "wss://westend-rpc.polkadot.io/",
  },
  unit: {
    image: "https://svgur.com/i/Jiy.svg",
    symbol: "WST",
  },
};

export const defaultConfiguration: SnapConfigState = kusamaConfiguration;