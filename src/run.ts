import { handleWindowMessage } from "./functions/handleWindowMessage";
import { onWindowMessage } from "pixel-pigeon";

export const run = (): void => {
  onWindowMessage(handleWindowMessage);
};
