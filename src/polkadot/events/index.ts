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
    this.listeners[event].push(listener);
    return this;
  }

  emit(event: PolkadotEvent, ...args: unknown[]): boolean {
    this.listeners[event].forEach(callback => callback(args));
    return true;
  }

  removeListener(event: PolkadotEvent, listener: (...args: unknown[]) => void): this {
    this.listeners[event] = this.listeners[event].filter(l => l != listener);
    return this;
  }
}

export const polkadotEventEmitter: EventEmitter<PolkadotEvent> = new EventEmitterPolkadotImplementation();