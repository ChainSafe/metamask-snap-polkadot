export type Network = "kusama" | "westend";

export interface UnitConfiguration {
  symbol: string;
  image?: string;
  customViewUrl?: string;
}

export interface NetworkConfiguration {
  wsRpcUrl: string;
  addressPrefix: number;
}

export interface SnapConfig {
  network: Network | NetworkConfiguration;
  unit?: UnitConfiguration;
}