import { Battler } from "../../classes/Battler";
import { CombatantType, ResourcePool } from "retrommo-types";
import { getDefinable } from "definables";

export const getBattlerResourcePool = (battlerID: string): ResourcePool => {
  const battler: Battler = getDefinable(Battler, battlerID);
  switch (battler.type) {
    case CombatantType.Monster: {
      return ResourcePool.MP;
    }
    case CombatantType.Player: {
      return battler.battleCharacter.class.resourcePool;
    }
  }
};
