import { createMainMenuUI } from "./main-menu/createMainMenuUI";
import { createWorldUI } from "./world/createWorldUI";

export const createUI = (): void => {
  createMainMenuUI();
  createWorldUI();
};
