import { Ability } from "../../classes/Ability";
import { Battler } from "../../classes/Battler";
import { ResourcePool } from "retrommo-types";
import { getBattlerResourcePool } from "./getBattlerResourcePool";
import { getDefinable } from "definables";

export const canBattlerAffordAbility = (
  battlerID: string,
  abilityID: string,
): boolean => {
  const battler: Battler = getDefinable(Battler, battlerID);
  const ability: Ability = getDefinable(Ability, abilityID);
  const resourcePool: ResourcePool = getBattlerResourcePool(battler.id);
  switch (resourcePool) {
    case ResourcePool.MP: {
      if (battler.resources.mp === null) {
        throw new Error("mp is null");
      }
      return ability.mpCost <= battler.resources.mp;
    }
    case ResourcePool.Will: {
      if (battler.resources.will === null) {
        throw new Error("will is null");
      }
      return ability.willCost <= battler.resources.will;
    }
    default: {
      throw new Error("resourcePool is not valid");
    }
  }
};
