export type Network = "kusama" | "westend";

export interface UnitConfiguration {
  symbol: string;
  image?: string;
  customViewUrl?: string;
}

export interface NetworkConfiguration {
  wsRpcUrl: string;
  unit: UnitConfiguration;
  addressPrefix: number;
}
