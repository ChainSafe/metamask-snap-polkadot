export enum PolkadotEvent {
  OnBalanceChange = "onBalanceChange"
}

export interface EventEmitter<K = keyof PolkadotEvent>  {
  addListener(event: K, origin: string, listener: EventCallback): this;
  removeListener(event: K, origin: string, listener: EventCallback): this;
  removeAllListeners(event: K, origin: string): this;
  emit(event: K, origin: string, ...args: unknown[]): boolean;
}

export type EventCallback = (...args: unknown[]) => void;

class EventEmitterPolkadotImplementation implements EventEmitter<PolkadotEvent> {

  private listeners: Record<string, Record<PolkadotEvent, EventCallback[]>>;

  addListener(event: PolkadotEvent, origin: string, listener: (...args: unknown[]) => void): this {
    // create listeners structure if first call
    if (!this.listeners) {
      this.listeners = {
        [origin]: {
          [event]: []
        }
      };
    }
    // initialize slot for origin if it doesn't exist
    if (!this.listeners[origin]) {
      this.listeners[origin] = {
        [event]: []
      };
    }
    // add listener
    this.listeners[origin][event].push(listener);
    return this;
  }

  emit(event: PolkadotEvent, origin: string, ...args: unknown[]): boolean {
    if (this.isDefined(event, origin)) {
      this.listeners[origin][event].forEach(callback => callback(args));
      return this.listeners[origin][event].length != 0;
    }
    return false;
  }

  removeListener(event: PolkadotEvent, origin: string, listener: (...args: unknown[]) => void): this {
    if (this.isDefined(event, origin)) {
      this.listeners[origin][event] = this.listeners[origin][event].filter(l => l != listener);
    }
    return this;
  }

  removeAllListeners(event: PolkadotEvent, origin: string): this {
    if (this.isDefined(event, origin)) {
      this.listeners[origin][event] = [];
    }
    return this;
  }

  private isDefined = (event: PolkadotEvent, origin: string): boolean =>
    !!(this.listeners && this.listeners[origin] && this.listeners[origin][event]);
}

export const polkadotEventEmitter: EventEmitter<PolkadotEvent> = new EventEmitterPolkadotImplementation();