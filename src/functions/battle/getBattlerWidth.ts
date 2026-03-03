import { Battler } from "../../classes/Battler";
import { CombatantType } from "retrommo-types";
import { getDefinable } from "definables";

export const getBattlerWidth = (battlerID: string): number => {
  const battler: Battler = getDefinable(Battler, battlerID);
  switch (battler.type) {
    case CombatantType.Monster: {
      return battler.monster.battleWidth;
    }
    case CombatantType.Player: {
      return 32;
    }
  }
};
