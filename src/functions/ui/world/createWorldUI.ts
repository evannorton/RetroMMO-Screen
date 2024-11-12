import { createWorldBottomBarUI } from "./createWorldBottomBarUI";
import { createWorldInteractUI } from "./createWorldInteractUI";
import { createWorldLogoutUI } from "./createWorldLogoutUI";

export const createWorldUI = (): void => {
  createWorldLogoutUI();
  createWorldBottomBarUI();
  createWorldInteractUI();
};
