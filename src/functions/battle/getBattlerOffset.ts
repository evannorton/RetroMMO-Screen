import { Battler } from "../../classes/Battler";
import { CombatantType } from "retrommo-types";
import { getDefinable } from "definables";

export const getBattlerOffset = (battlerID: string): number => {
  const battler: Battler = getDefinable(Battler, battlerID);
  switch (battler.type) {
    case CombatantType.Monster: {
      if (battler.monster.hasOffset()) {
        return battler.monster.offset;
      }
      return 0;
    }
    case CombatantType.Player: {
      return 0;
    }
  }
};
