export enum PolkadotEvent {
    OnBalanceChange = "onBalanceChange"
}

export interface PolkadotApi {
    on(eventName: PolkadotEvent, callback: EventCallback): boolean;
    removeListener(eventName: PolkadotEvent, callback: EventCallback): boolean;
    removeAllListeners(eventName: PolkadotEvent): boolean;
}

export type EventCallback = (...args: unknown[]) => void;