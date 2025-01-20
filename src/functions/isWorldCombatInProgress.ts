import { spellbookWorldMenu } from "../world-menus/spellbookWorldMenu";

export const isWorldCombatInProgress = (): boolean =>
  spellbookWorldMenu.isOpen() &&
  spellbookWorldMenu.state.values.isAwaitingWorldCombat;
