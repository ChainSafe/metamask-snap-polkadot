import {Wallet} from "../interfaces";

export async function showConfirmationDialog(wallet: Wallet, message: string): Promise<boolean> {
  const confirmation = await wallet.send({
    method: 'confirm',
    params: [message]
  });

  return confirmation.result == true;
}