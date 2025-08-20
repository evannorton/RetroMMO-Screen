import { Ability } from "../../classes/Ability";
import { BattleSubmittedAbilityUpdate } from "retrommo-types";
import { Battler } from "../../classes/Battler";
import { getDefinable } from "definables";

export const loadBattleSubmittedAbilityUpdate = (
  battleSubmittedAbilityUpdate: BattleSubmittedAbilityUpdate,
): void => {
  getDefinable(
    Battler,
    battleSubmittedAbilityUpdate.casterBattlerID,
  ).battleCharacter.submittedMove = {
    actionDefinableReference: getDefinable(
      Ability,
      battleSubmittedAbilityUpdate.abilityID,
    ).getReference(),
    battlerID: battleSubmittedAbilityUpdate.targetBattlerID,
  };
};
