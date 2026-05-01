import { duelInviteWorldMenu } from "../world-menus/duelInviteWorldMenu";
import { isWorldCombatInProgress } from "./isWorldCombatInProgress";
import { partyInviteWorldMenu } from "../world-menus/partyInviteWorldMenu";
import { tradeInviteWorldMenu } from "../world-menus/tradeInviteWorldMenu";
import { tradeWorldMenu } from "../world-menus/tradeWorldMenu";

export const isForcedWorldUIVisible = (): boolean =>
  isWorldCombatInProgress() ||
  tradeWorldMenu.isOpen() ||
  duelInviteWorldMenu.isOpen() ||
  partyInviteWorldMenu.isOpen() ||
  tradeInviteWorldMenu.isOpen();
