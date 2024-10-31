import { createUI } from "./functions/ui/createUI";
import { handleError, onTick, onWindowMessage } from "pixel-pigeon";
import { handleWindowMessage } from "./functions/handleWindowMessage";
import { loadGameData } from "./functions/loadGameData";
import { loadServerURL } from "./functions/loadServerURL";
import { postWindowMessage } from "./functions/postWindowMessage";
import { processEntitiesInitialPositions } from "./functions/processEntitiesInitialPositions";
import { tick } from "./tick";

export const run = (): void => {
  loadServerURL();
  loadGameData()
    .then((): void => {
      processEntitiesInitialPositions();
      createUI();
      postWindowMessage({ event: "run" });
      onWindowMessage(handleWindowMessage);
      onTick(tick);
    })
    .catch((error: unknown): void => {
      handleError(error);
    });
};
