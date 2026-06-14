import { WorldMenu } from "../../classes/WorldMenu";
import { getDefinables } from "definables";

export interface CloseWorldMenusOptions {
  readonly bypassOnClose?: boolean;
}
export const closeWorldMenus = (options: CloseWorldMenusOptions): void => {
  getDefinables(WorldMenu).forEach(
    (worldMenu: WorldMenu<unknown, object>): void => {
      if (worldMenu.isOpen()) {
        worldMenu.close({ bypassOnClose: options.bypassOnClose });
      }
    },
  );
};
