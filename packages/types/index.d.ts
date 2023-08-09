import { SignerPayloadJSON, SignerPayloadRaw } from "@polkadot/types/types";

export interface GetPublicKeyRequest {
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

export interface GetChainHeadRequest {
  method: "getChainHead";
}

export interface SignPayloadJSONRequest {
  method: "signPayloadJSON";
  params: {
    payload: SignerPayloadJSON;
  };
}

export interface SignPayloadRawRequest {
  method: "signPayloadRaw";
  params: {
    payload: SignerPayloadRaw;
  };
}

export interface GenerateTransactionPayload {
  method: "generateTransactionPayload";
  params: {
    amount: string|number;
    to: string;
  };
}

export interface SendUnitRequest {
  method: "send";
  params: {
    signature: string;
    txPayload: TxPayload;
  };
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
    | GetChainHeadRequest
    | SignPayloadJSONRequest
    | SignPayloadRawRequest
    | SendUnitRequest
    | GenerateTransactionPayload;

type Method = MetamaskPolkadotRpcRequest["method"];

export interface WalletEnableRequest {
  method: "wallet_enable";
  params: object[];
}

export interface GetPluginsRequest {
  method: "wallet_getPlugins";
}

export interface SnapRpcMethodRequest {
  method: string;
  params: [MetamaskPolkadotRpcRequest];
}

export type MetamaskRpcRequest = WalletEnableRequest | GetPluginsRequest | SnapRpcMethodRequest;

export type BlockId = number | string | "latest";

export interface TxPayload {
  tx: string;
  payload: SignerPayloadJSON;
}

export interface BlockInfo {
  hash: string;
  number: string;
}

export interface UnitConfiguration {
  symbol: string;
  decimals: number;
  image?: string;
  customViewUrl?: string;
}

export type SnapNetworks = "polkadot" | "kusama" | "westend";

export interface SnapConfig {
  networkName: SnapNetworks;
  wsRpcUrl?: string;
  addressPrefix?: number;
  unit?: UnitConfiguration;
}

// Polkadot types

export type Callback<T> = (arg: T) => void;

export type PolkadotEventArgument = Balance;
export type PolkadotEventCallback = Callback<PolkadotEventArgument>;

export type TxEventArgument = TxStatus;
export type TxEventCallback = Callback<TxEventArgument>;

export type Balance = string;
export type TxStatus = {
  txHash: string;
};

export type Origin = string;
export type HexHash = string;

export interface Transaction {
  hash: string;
  block: string;
  sender: string;
  destination: string;
  amount: string | number;
  fee: string;
}
