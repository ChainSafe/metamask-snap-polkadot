export type Network = "kusama" | "westend";

export type CustomViewUrlCallBack = (address: string) => string;
export interface UnitConfiguration {
  symbol: string;
  image?: string;
  customViewUrl?: string | CustomViewUrlCallBack;
}

export interface NetworkConfiguration {
  wsRpcUrl: string;
  unit: UnitConfiguration;
  addressPrefix: number;
}
