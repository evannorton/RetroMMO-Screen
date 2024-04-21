import { createUI } from "./functions/createUI/createUI";
import { handleWindowMessage } from "./functions/handleWindowMessage";
import { loadGameData } from "./functions/loadGameData";
import { loadServerURL } from "./functions/loadServerURL";
import { onWindowMessage } from "pixel-pigeon";

export const run = (): void => {
  loadServerURL();
  loadGameData();
  onWindowMessage(handleWindowMessage);
  createUI();
};
