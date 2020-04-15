export enum PolkadotEvent {
  OnBalanceChange = "onBalanceChange"
}

export interface EventEmitter<K = keyof PolkadotEvent>  {
  addListener(event: K, listener: EventCallback): this;
  removeListener(event: K, listener: EventCallback): this;
  emit(event: K, ...args: unknown[]): boolean;
}

export type EventCallback = (...args: unknown[]) => void;

class EventEmitterPolkadotImplementation implements EventEmitter<PolkadotEvent> {

  private readonly listeners: Record<PolkadotEvent, EventCallback[]>;

  constructor() {
    this.listeners = {
      [PolkadotEvent.OnBalanceChange]: []
    };
  }

  addListener(event: PolkadotEvent, listener: (...args: unknown[]) => void): this {
    console.log("BEFORE ADD");
    console.log(this.listeners);
    this.listeners[event].push(listener);
    console.log("AFTER ADD");
    console.log(this.listeners);
    return this;
  }

  emit(event: PolkadotEvent, ...args: unknown[]): boolean {
    this.listeners[event].forEach(callback => callback(args));
    return true;
  }

  removeListener(event: PolkadotEvent, listener: (...args: unknown[]) => void): this {
    console.log("BEFORE REMOVE");
    console.log(this.listeners);
    this.listeners[event] = this.listeners[event].filter(l => l != listener);
    console.log("AFTER REMOVE");
    console.log(this.listeners);
    return this;
  }
}

export const polkadotEventEmitter: EventEmitter<PolkadotEvent> = new EventEmitterPolkadotImplementation();