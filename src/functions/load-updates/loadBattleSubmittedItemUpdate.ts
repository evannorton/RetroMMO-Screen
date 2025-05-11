import { BattleSubmittedItemUpdate } from "retrommo-types";
import { Battler } from "../../classes/Battler";
import { Item } from "../../classes/Item";
import { getDefinable } from "definables";

export const loadBattleSubmittedItemUpdate = (
  battleSubmittedItemUpdate: BattleSubmittedItemUpdate,
): void => {
  getDefinable(
    Battler,
    battleSubmittedItemUpdate.casterBattlerID,
  ).battleCharacter.submittedMove = {
    actionDefinableReference: getDefinable(
      Item,
      battleSubmittedItemUpdate.itemID,
    ).getReference(),
    battlerID: battleSubmittedItemUpdate.targetBattlerID,
  };
};
