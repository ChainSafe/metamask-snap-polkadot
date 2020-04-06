import {Configuration} from "../configuration/configuration";
import {kusamaConfiguration, westendConfiguration} from "./configurations";
import {NetworkConfiguration} from "./interfaces";

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