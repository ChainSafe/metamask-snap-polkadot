import {pluginOrigin} from "./metamask";

export async function getAllTransactions(address?: string): Promise<any> {
    try {
      return await window.ethereum.send({
        method: pluginOrigin,
        params: [{
          method: 'getAllTransactions',
            params: {
              address
            }
        }]
      });
    } catch (e) {
      console.log("Unable to fetch transactions", e);
    }
  }
