
export interface GetPublicKeyRequest{
  method: "getPublicKey";
}

export interface GetAddressRequest {
  method: "getAddress";
}

export interface ExportSeedRequest {
  method: "exportSeed";
}

export interface GetTransactionsRequest {
  method: "getAllTransactions";
  params: {
    address?: string;
  };
}

export interface GetBlockRequest {
  method: "getBlock";
  params: {
    blockTag?: BlockId;
  };
}

export interface GetBalanceRequest {
  method: "getBalance";
}


export interface ConfigureSnapRequest {
  method: "configure";
  params: {
    configuration: SnapConfig;
  };
}

export interface AddPolkadotAssetRequest {
  method: "addPolkadotAsset";
}

export interface RemovePolkadotAssetRequest {
  method: "removePolkadotAsset";
}

export interface GetChainHeadRequest {
  method: "getChainHead";
}

export type MetamaskPolkadotRpcRequest =
    GetPublicKeyRequest
    | GetAddressRequest
    | ExportSeedRequest
    | GetTransactionsRequest
    | GetBlockRequest
    | GetBalanceRequest
    | ConfigureSnapRequest
    | AddPolkadotAssetRequest
    | RemovePolkadotAssetRequest
    | GetChainHeadRequest;

type Method = MetamaskPolkadotRpcRequest["method"];

export type BlockId = number|string|"latest";

export interface BlockInfo {
  hash: string;
  number: string;
}

export interface UnitConfiguration {
  symbol: string;
  decimals: number;
  assetId: string;
  image?: string;
  customViewUrl?: string;
}

export interface SnapConfig {
  networkName: string;
  wsRpcUrl?: string;
  addressPrefix?: number;
  unit?: UnitConfiguration;
}

// Polkadot types

export type EventCallback = (...args: unknown[]) => void;

export type PolkadotEvent = "onBalanceChange"|"onTransactionStatus";

export interface PolkadotApi {
  on(eventName: PolkadotEvent, callback: EventCallback): boolean;
  removeListener(eventName: PolkadotEvent, callback: EventCallback): boolean;
  removeAllListeners(eventName: PolkadotEvent): boolean;
}