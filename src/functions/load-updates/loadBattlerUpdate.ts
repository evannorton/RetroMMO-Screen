import { Battler } from "../../classes/Battler";
import { BattlerUpdate } from "retrommo-types";

export const loadBattlerUpdate = (battlerUpdate: BattlerUpdate): void => {
  new Battler(battlerUpdate.id, {
    battleCharacterID: battlerUpdate.characterID,
    gold: battlerUpdate.gold,
    isAlive: battlerUpdate.isAlive,
    monsterID: battlerUpdate.monsterID,
    resources: battlerUpdate.resources,
    type: battlerUpdate.type,
  });
};
