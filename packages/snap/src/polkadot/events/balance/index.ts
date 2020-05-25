import {Wallet} from "../../../interfaces";
import {polkadotEventEmitter} from "../index";
import {getApi} from "../../api";
import {getKeyPair} from "../../account";
import {updateAsset} from "../../../asset";

let unsubscribe: Record<string, any>;

export async function registerOnBalanceChange(wallet: Wallet, origin: string): Promise<void> {
  const api = await getApi(wallet);
  const address = (await getKeyPair(wallet)).address;
  console.log("REGISTER ON BALANCE CHANGE");
  // Here we subscribe to any balance changes and update the on-screen value
  const unsubscribeCallback = await api.query.system.account(address, ({data: { free: currentFree }}) => {
    // updateAsset(wallet, origin, currentFree.toString());
    // polkadotEventEmitter.emit("onBalanceChange", origin, currentFree.toString());
    console.log(currentFree)
  });
  if (!unsubscribe) {
    console.log("CALLING UNSUBSCRIBE FUNCTION");
    unsubscribeCallback();
    unsubscribe = {
      [origin]: unsubscribeCallback
    };
  } else {
    // clean up if already subscribed
    if (unsubscribe[origin]) {
      unsubscribe[origin]();
    }
    // register new unsubscribe callback
    unsubscribe[origin] = unsubscribeCallback;
  }
}

export function removeOnBalanceChange(origin: string): void {
  if (unsubscribe && unsubscribe[origin]) {
    // console.log("CALLING UNSUBSCRIBE FUNCTION");
    // console.log(unsubscribe[origin]);
    // try {
    //   unsubscribe[origin]();
    //   delete unsubscribe[origin];
    // } catch (e) {
    //   console.log("ERROR ON UNSUBSCRIPTION");
    //   console.log(e);
    // }
  }
}
