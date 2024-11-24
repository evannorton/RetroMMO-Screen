import { WorldMenu } from "../../classes/WorldMenu";
import { getDefinables } from "definables";

export const closeWorldMenus = (): void => {
  getDefinables(WorldMenu).forEach(
    (worldMenu: WorldMenu<unknown, unknown>): void => {
      if (worldMenu.isOpen()) {
        worldMenu.close();
      }
    },
  );
};
