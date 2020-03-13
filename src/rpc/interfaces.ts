import {RequestObject, Wallet} from "../interfaces";

export interface RpcMethod {
  execute(wallet: Wallet, request: RequestObject): unknown;
}