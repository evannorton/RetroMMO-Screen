import { inventoryWorldMenu } from "../world-menus/inventoryWorldMenu";
import { spellbookWorldMenu } from "../world-menus/spellbookWorldMenu";

export const isWorldCombatInProgress = (): boolean =>
  (spellbookWorldMenu.isOpen() &&
    spellbookWorldMenu.state.values.isAwaitingWorldCombat) ||
  (inventoryWorldMenu.isOpen() &&
    inventoryWorldMenu.state.values.isAwaitingWorldCombat);
