import { SnapsGlobalObject } from "@metamask/snaps-types";
import { panel, text } from "@metamask/snaps-ui";

type ConfirmationDialogContent = {
  prompt: string;
  description?: string;
  textAreaContent?: string;
};

export async function showConfirmationDialog(
  snap: SnapsGlobalObject,
  message: ConfirmationDialogContent,
): Promise<boolean> {
  return (await snap.request({
    method: "snap_dialog",
    params: {
      content: panel([
        text(message.prompt),
        text(message.description),
        text(message.textAreaContent),
      ]),
      type: "confirmation",
    },
  })) as boolean;
}
