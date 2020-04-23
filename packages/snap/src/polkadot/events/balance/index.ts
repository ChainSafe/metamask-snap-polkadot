import {Wallet} from "../../../interfaces";
import {polkadotEventEmitter} from "../index";
import {getApi} from "../../api";

let unsubscribe: Record<string, () => void>;

export async function registerOnBalanceChange(wallet: Wallet, origin: string): Promise<void> {
  const api = await getApi(wallet);
  const state = wallet.getPluginState();
  const address = state.polkadot.account.keyring.address;
  // Here we subscribe to any balance changes and update the on-screen value
  const unsubscribeCallback = await api.query.system.account(address, ({ data: { free: currentFree }}) => {
    polkadotEventEmitter.emit("onBalanceChange", currentFree.toString(), origin);
  });
  if (!unsubscribe) {
    unsubscribe = {
      [origin]: unsubscribeCallback
    };
  } else {
    unsubscribe[origin] = unsubscribeCallback;
  }
}

export function removeOnBalanceChange(origin: string): void {
  unsubscribe[origin]();
  delete unsubscribe[origin];
}