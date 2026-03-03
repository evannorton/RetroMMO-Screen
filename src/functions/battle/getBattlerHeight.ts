import { Battler } from "../../classes/Battler";
import { CombatantType } from "retrommo-types";
import { getDefinable } from "definables";

export const getBattlerHeight = (battlerID: string): number => {
  const battler: Battler = getDefinable(Battler, battlerID);
  switch (battler.type) {
    case CombatantType.Monster: {
      return battler.monster.battleHeight;
    }
    case CombatantType.Player: {
      return 32;
    }
  }
};
