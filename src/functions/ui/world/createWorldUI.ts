import { createWorldBottomBarUI } from "./createWorldBottomBarUI";
import { createWorldCombatUI } from "./createWorldCombatUI";
import { createWorldInteractUI } from "./createWorldInteractUI";
import { createWorldLogoutUI } from "./createWorldLogoutUI";

export const createWorldUI = (): void => {
  createWorldBottomBarUI();
  createWorldCombatUI();
  createWorldInteractUI();
  createWorldLogoutUI();
};
