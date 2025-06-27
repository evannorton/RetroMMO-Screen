import { Battler } from "../../classes/Battler";
import { BattlerType, ResourcePool } from "retrommo-types";
import { getDefinable } from "definables";

export const getBattlerResourcePool = (battlerID: string): ResourcePool => {
  const battler: Battler = getDefinable(Battler, battlerID);
  switch (battler.type) {
    case BattlerType.Monster: {
      return ResourcePool.MP;
    }
    case BattlerType.Player: {
      return battler.battleCharacter.class.resourcePool;
    }
  }
};
