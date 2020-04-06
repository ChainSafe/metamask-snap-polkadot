import {Configuration} from "../configuration/configuration";
import {kusamaConfiguration, westendConfiguration} from "./configurations";

export type Network = "kusama" | "westend";

export interface NetworkConfiguration {
  wsRpcUrl: string;
  unit: {
    symbol: string;
    image?: string;
    customViewUrl?: string | CustomViewUrlCallBack ;
  };
  addressPrefix: number;
}

export type CustomViewUrlCallBack = (address: string) => string;

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