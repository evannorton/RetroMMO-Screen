import { Battler } from "../../classes/Battler";
import { BattlerType, ResourcePool } from "retrommo-types";
import { getDefinable } from "definables";

export const doesBattlerHaveMP = (battlerID: string): boolean => {
  const battler: Battler = getDefinable(Battler, battlerID);
  switch (battler.type) {
    case BattlerType.Monster: {
      return true;
    }
    case BattlerType.Player: {
      return battler.battleCharacter.class.resourcePool === ResourcePool.MP;
    }
  }
};
