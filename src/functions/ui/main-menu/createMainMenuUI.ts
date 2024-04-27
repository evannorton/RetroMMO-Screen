import { createCharacterCreateUI } from "./createCharacterCreateUI";
import { createCharacterCustomizeUI } from "./createCharacterCustomizeUI";
import { createCharacterSelectUI } from "./createCharacterSelectUI";

export const createMainMenuUI = (): void => {
  createCharacterSelectUI();
  createCharacterCreateUI();
  createCharacterCustomizeUI();
};
