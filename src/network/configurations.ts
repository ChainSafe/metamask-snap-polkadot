import {NetworkConfiguration} from "./network";

export const defaultConfiguration: NetworkConfiguration = {
  addressPrefix: 1,
  unit: {
    customViewUrl: "https://polkascan.io/pre/kusama/account/",
    image: '', // ispraviti sliku
    symbol: "KSM",
  },
  wsRpcUrl: "wss://kusama-rpc.polkadot.io/",
};

export const kusamaConfiguration: NetworkConfiguration = {
  addressPrefix: 1,
  unit: {
    customViewUrl: "https://polkascan.io/pre/kusama/account/",
    image: 'https://svgur.com/i/Jiy.svg', // ispraviti sliku
    symbol: "KSM",
  },
  wsRpcUrl: "wss://kusama-rpc.polkadot.io/",
};

export const westendConfiguration: NetworkConfiguration = {
  addressPrefix: 1,
  unit: {
    customViewUrl: "https://polkascan.io/pre/kusama/account/",
    image: 'https://svgur.com/i/Jiy.svg', // ispraviti sliku
    symbol: "KSM",
  },
  wsRpcUrl: "wss://kusama-rpc.polkadot.io/",
};