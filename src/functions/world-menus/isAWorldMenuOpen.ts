import { WorldMenu } from "../../classes/WorldMenu";
import { getDefinables } from "definables";

export const isAWorldMenuOpen = (): boolean => {
  for (const worldMenu of getDefinables(WorldMenu).values()) {
    if (worldMenu.isOpen()) {
      return true;
    }
  }
  return false;
};
