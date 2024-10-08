import { createUI } from "./functions/ui/createUI";
import { handleError, onWindowMessage } from "pixel-pigeon";
import { handleWindowMessage } from "./functions/handleWindowMessage";
import { loadGameData } from "./functions/loadGameData";
import { loadServerURL } from "./functions/loadServerURL";
import { postWindowMessage } from "./functions/postWindowMessage";

export const run = (): void => {
  loadServerURL();
  loadGameData()
    .then((): void => {
      createUI();
      postWindowMessage({ event: "run" });
      onWindowMessage(handleWindowMessage);
    })
    .catch((error: unknown): void => {
      handleError(error);
    });
};
