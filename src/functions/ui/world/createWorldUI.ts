import { createWorldBottomBarUI } from "./createWorldBottomBarUI";
import { createWorldCombatHotkeysUI } from "./createWorldCombatHotkeysUI";
import { createWorldCombatUI } from "./createWorldCombatUI";
import { createWorldInteractUI } from "./createWorldInteractUI";
import { createWorldLogoutUI } from "./createWorldLogoutUI";

export const createWorldUI = (): void => {
  createWorldBottomBarUI();
  createWorldCombatHotkeysUI();
  createWorldCombatUI();
  createWorldInteractUI();
  createWorldLogoutUI();
};
