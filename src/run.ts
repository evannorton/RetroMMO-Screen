import { createUI } from "./functions/ui/createUI";
import { handleWindowMessage } from "./functions/handleWindowMessage";
import { loadGameData } from "./functions/loadGameData";
import { loadServerURL } from "./functions/loadServerURL";
import { onWindowMessage } from "pixel-pigeon";

export const run = (): void => {
  loadServerURL();
  loadGameData()
    .then((): void => {
      createUI();
    })
    .catch((error: unknown): void => {
      throw error;
    });
  onWindowMessage(handleWindowMessage);
};
