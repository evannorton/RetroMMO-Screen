import { Battler } from "../../classes/Battler";
import { BattlerUpdate } from "retrommo-types";

export const loadBattlerUpdate = (battlerUpdate: BattlerUpdate): void => {
  new Battler(battlerUpdate.id, {
    battleCharacterID: battlerUpdate.characterID,
    bleed:
      typeof battlerUpdate.bleed !== "undefined"
        ? { order: battlerUpdate.bleed.order }
        : undefined,
    gold: battlerUpdate.gold,
    isAlive: battlerUpdate.isAlive,
    monsterID: battlerUpdate.monsterID,
    poison:
      typeof battlerUpdate.poison !== "undefined"
        ? { order: battlerUpdate.poison.order }
        : undefined,
    resources:
      typeof battlerUpdate.resources !== "undefined"
        ? {
            hp: battlerUpdate.resources.hp,
            maxHP: battlerUpdate.resources.maxHP,
            maxMP: battlerUpdate.resources.maxMP,
            mp: battlerUpdate.resources.mp,
            will: battlerUpdate.resources.will,
          }
        : undefined,
    type: battlerUpdate.type,
  });
};
