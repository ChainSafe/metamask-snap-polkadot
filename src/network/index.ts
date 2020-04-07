import {NetworkConfiguration} from "./interfaces";
import {Configuration} from "../configuration/configuration";

export const defaultConfiguration: NetworkConfiguration = {
  addressPrefix: 1,
  unit: {
    customViewUrl: "https://polkascan.io/pre/kusama/account/",
    image: "", // dsafdsa
    symbol: "KSM",
  },
  wsRpcUrl: "wss://kusama-rpc.polkadot.io/",
};

export const kusamaConfiguration: NetworkConfiguration = {
  addressPrefix: 1,
  unit: {
    customViewUrl: "https://polkascan.io/pre/kusama/account/",
    image: "https://svgur.com/i/Jiy.svg", // ispraviti sliku
    symbol: "KSM",
  },
  wsRpcUrl: "wss://kusama-rpc.polkadot.io/",
};

export const westendConfiguration: NetworkConfiguration = {
  addressPrefix: 1,
  unit: {
    customViewUrl: "https://polkascan.io/pre/kusama/account/",
    image: "https://svgur.com/i/Jiy.svg", // ispraviti sliku
    symbol: "KSM",
  },
  wsRpcUrl: "wss://kusama-rpc.polkadot.io/",
};

export function getNetworkConfiguration(configuration: Configuration): NetworkConfiguration {
  switch (configuration.network) {
    case "kusama":
      return kusamaConfiguration;
    case "westend":
      return  westendConfiguration;
    default:
      // custom configuration
      return configuration.network;
  }
}