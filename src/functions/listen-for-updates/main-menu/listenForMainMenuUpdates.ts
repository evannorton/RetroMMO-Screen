import { listenForMainMenuCharacterCustomizeUpdates } from "./listenForMainMenuCharacterCustomizeUpdates";
import { listenForMainMenuCharacterSelectUpdates } from "./listenForMainMenuCharacterSelectUpdates";

export const listenForMainMenuUpdates = (): void => {
  listenForMainMenuCharacterSelectUpdates();
  listenForMainMenuCharacterCustomizeUpdates();
};
