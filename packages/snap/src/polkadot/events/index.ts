import {TxStatus} from "@chainsafe/metamask-polkadot-types";
import {EventEmitter} from "events";
import {StrictEmitterWithOriginProvider} from "./emitter";
import {StrictEventEmitter} from "strict-event-emitter-types";

// Polkadot event emitters

interface PolkadotEvents {
  onBalanceChange: string;
}

const polkadotEventsEmitterProvider = new StrictEmitterWithOriginProvider<PolkadotEvents>();

export function getPolkadotEventEmitter(origin: string): StrictEventEmitter<EventEmitter, PolkadotEvents> {
  return polkadotEventsEmitterProvider.getEventEmitter(origin);
}

// Transaction event emitters

interface TxEvents {
  included: TxStatus;
  finalized: TxStatus;
}

const txEventsEmitterProvider = new StrictEmitterWithOriginProvider<TxEvents>();

export function getTxEventEmitter(hash: string): StrictEventEmitter<EventEmitter, TxEvents> {
  return txEventsEmitterProvider.getEventEmitter(hash);
}