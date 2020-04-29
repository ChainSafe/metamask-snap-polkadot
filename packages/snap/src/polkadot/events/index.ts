import {
  EventCallback, HexHash, Origin, PolkadotEvent, TransactionEventStatus
} from "@nodefactory/metamask-polkadot-types";
import {EventEmitterImplementation} from "./emitter";

export interface EventEmitter<K = keyof string, T = keyof string>  {
  addListener(event: K, identifier: T, listener: EventCallback): this;
  removeListener(event: K, identifier: T, listener: EventCallback): this;
  removeAllListeners(event: K, identifier: T): this;
  getListenersCount(event: K, identifier: T): number;
  emit(event: K, identifier: T, ...args: unknown[]): boolean;
}

export const polkadotEventEmitter: EventEmitter<PolkadotEvent, Origin> = new EventEmitterImplementation();
export const txEventEmitter: EventEmitter<TransactionEventStatus, HexHash> = new EventEmitterImplementation();
