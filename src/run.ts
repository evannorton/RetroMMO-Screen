import { createUI } from "./functions/ui/createUI";
import { handleWindowMessage } from "./functions/handleWindowMessage";
import { loadGameData } from "./functions/loadGameData";
import { loadServerURL } from "./functions/loadServerURL";
import { onWindowMessage } from "pixel-pigeon";
import { postWindowMessage } from "./functions/postWindowMessage";

export const run = (): void => {
  postWindowMessage({ event: "run" });
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
