import {NetworkConfiguration} from "./interfaces";
import {Configuration} from "../configuration";

export const kusamaConfiguration: NetworkConfiguration = {
  addressPrefix: 1,
  unit: {
    image: "https://svgur.com/i/Jiy.svg",
    symbol: "KSM",
  },
  wsRpcUrl: "wss://kusama-rpc.polkadot.io/",
};

export const westendConfiguration: NetworkConfiguration = {
  addressPrefix: 1,
  unit: {
    image: "https://svgur.com/i/Jiy.svg",
    symbol: "KSM",
  },
  wsRpcUrl: "wss://kusama-rpc.polkadot.io/",
};

export const defaultConfiguration: NetworkConfiguration = kusamaConfiguration;

export function getNetworkConfiguration(configuration: Configuration): NetworkConfiguration {
  switch (configuration.network) {
    case "kusama":
      console.log("Kusama configuration selected");
      return kusamaConfiguration;
    case "westend":
      console.log("Westend configuration selected");
      return  westendConfiguration;
    default:
      // custom configuration
      console.log("Custom configuration selected");
      return configuration.network;
  }
}