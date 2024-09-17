import { createWorldBottomBarUI } from "./createWorldBottomBarUI";
import { createWorldLogoutUI } from "./createWorldLogoutUI";

export const createWorldUI = (): void => {
  createWorldLogoutUI();
  createWorldBottomBarUI();
};
