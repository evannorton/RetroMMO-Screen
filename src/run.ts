import { RunUpstreamWindowMessage } from "retrommo-types";
import { createUI } from "./functions/ui/createUI";
import {
  handleError,
  onInputCollectionsChange,
  onTick,
  onWindowMessage,
} from "pixel-pigeon";
import { handleInput } from "./functions/handleInput";
import { handleWindowMessage } from "./functions/handleWindowMessage";
import { loadGameData } from "./functions/loadGameData";
import { loadServerURL } from "./functions/loadServerURL";
import { postKeybinds } from "./functions/postKeybinds";
import { postWindowMessage } from "./functions/postWindowMessage";
import { processEntitiesInitialPositions } from "./functions/processEntitiesInitialPositions";
import { tick } from "./tick";

export const run = (): void => {
  handleInput();
  loadServerURL();
  loadGameData()
    .then((): void => {
      processEntitiesInitialPositions();
      createUI();
      postWindowMessage<RunUpstreamWindowMessage>({
        data: {},
        event: "run",
      });
      onWindowMessage(handleWindowMessage);
      onInputCollectionsChange(postKeybinds);
      postKeybinds();
      onTick(tick);
    })
    .catch((error: unknown): void => {
      handleError(error);
    });
};
