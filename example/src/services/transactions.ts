import {pluginOrigin} from "./metamask";

export async function getAllTransactions(): Promise<any> {
    try {
      return await window.ethereum.send({
        method: pluginOrigin,
        params: [{
          method: 'getAllTransactions'
        }]
      });
    } catch (e) {
      console.log("Unable to fetch transactions", e);
    }
  }
