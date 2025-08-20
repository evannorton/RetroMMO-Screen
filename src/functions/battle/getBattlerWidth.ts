import { Battler } from "../../classes/Battler";
import { BattlerType } from "retrommo-types";
import { getDefinable } from "definables";

export const getBattlerWidth = (battlerID: string): number => {
  const battler: Battler = getDefinable(Battler, battlerID);
  switch (battler.type) {
    case BattlerType.Monster: {
      return battler.monster.battleWidth;
    }
    case BattlerType.Player: {
      return 32;
    }
  }
};
