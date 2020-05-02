import {EventCallback} from "@nodefactory/metamask-polkadot-types";
import {EventEmitter} from "./index";

export class EventEmitterImplementation<T extends string, K extends string> implements EventEmitter<T, K> {

  private listeners: Record<K, Record<T, EventCallback[]>>;

  addListener(event: T, identifier: K, listener: (...args: unknown[]) => void): this {
    // create listeners structure if first call
    if (!this.listeners) {
      this.listeners = {
        [identifier]: {
          [event]: []
        }
      } as Record<K, Record<T, EventCallback[]>>;
    }
    // initialize slot for origin if it doesn't exist
    if (!this.listeners[identifier]) {
      this.listeners[identifier] = {
        [event]: []
      } as Record<T, EventCallback[]>;
    }

    // initialize slot for event if it doesn't exist
    if (!this.listeners[identifier][event]) {
      this.listeners[identifier][event] = [];
    }

    // add listener
    this.listeners[identifier][event].push(listener);
    return this;
  }

  emit(event: T, identifier: K, ...args: unknown[]): boolean {
    if (this.hasAttachedListeners(event, identifier)) {
      this.listeners[identifier][event].forEach(callback => callback(args));
      return this.listeners[identifier][event].length != 0;
    }
    return false;
  }

  removeListener(event: T, identifier: K, listener: (...args: unknown[]) => void): this {
    if (this.hasAttachedListeners(event, identifier)) {
      this.listeners[identifier][event] = this.listeners[identifier][event].filter(l => l != listener);
    }
    return this;
  }

  removeAllListeners(event: T, identifier: K): this {
    if (this.hasAttachedListeners(event, identifier)) {
      this.listeners[identifier][event] = [];
    }
    return this;
  }

  getListenersCount(event: T, origin: K): number {
    if (this.hasAttachedListeners(event, origin)) {
      return this.listeners[origin][event].length;
    }
    return 0;
  }

  private hasAttachedListeners = (event: T, identifier: K): boolean =>
    !!(this.listeners && this.listeners[identifier] && this.listeners[identifier][event]);
}