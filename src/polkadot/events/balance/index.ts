import {Wallet} from "../../../interfaces";
import {PolkadotEvent, polkadotEventEmitter} from "../index";
import {getApi} from "../../api";

export async function registerOnBalanceChange(wallet: Wallet): Promise<void> {
  const api = await getApi(wallet);
  const state = wallet.getPluginState();
  const address = state.polkadot.account.keyring.address;
  // Here we subscribe to any balance changes and update the on-screen value
  api.query.system.account(address, ({ data: { free: currentFree }}) => {
    polkadotEventEmitter.emit(PolkadotEvent.OnBalanceChange, currentFree);
  });
}