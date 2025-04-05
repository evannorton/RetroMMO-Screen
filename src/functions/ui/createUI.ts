import { createBattleUI } from "./battle/createBattleUI";
import { createMainMenuUI } from "./main-menu/createMainMenuUI";
import { createWorldUI } from "./world/createWorldUI";

export const createUI = (): void => {
  createBattleUI();
  createMainMenuUI();
  createWorldUI();
};
