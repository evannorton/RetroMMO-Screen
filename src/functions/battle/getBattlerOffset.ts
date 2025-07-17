import { Battler } from "../../classes/Battler";
import { BattlerType } from "retrommo-types";
import { getDefinable } from "definables";

export const getBattlerOffset = (battlerID: string): number => {
  const battler: Battler = getDefinable(Battler, battlerID);
  switch (battler.type) {
    case BattlerType.Monster: {
      return battler.monster.offset;
    }
    case BattlerType.Player: {
      return 0;
    }
  }
};
