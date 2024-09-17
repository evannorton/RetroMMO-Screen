import { createMainMenuCharacterCreateUI } from "./createMainMenuCharacterCreateUI";
import { createMainMenuCharacterCustomizeUI } from "./createMainMenuCharacterCustomizeUI";
import { createMainMenuCharacterSelectUI } from "./createMainMenuCharacterSelectUI";

export const createMainMenuUI = (): void => {
  createMainMenuCharacterSelectUI();
  createMainMenuCharacterCreateUI();
  createMainMenuCharacterCustomizeUI();
};
