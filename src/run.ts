import { createUI } from "./functions/ui/createUI";
import { goToLevel, onWindowMessage } from "pixel-pigeon";
import { handleWindowMessage } from "./functions/handleWindowMessage";
import { loadGameData } from "./functions/loadGameData";
import { loadServerURL } from "./functions/loadServerURL";
import { postWindowMessage } from "./functions/postWindowMessage";

export const run = (): void => {
  postWindowMessage({ event: "run" });
  loadServerURL();
  loadGameData()
    .then((): void => {
      createUI();
      goToLevel("overworld");
    })
    .catch((error: unknown): void => {
      throw error;
    });
  onWindowMessage(handleWindowMessage);
};
