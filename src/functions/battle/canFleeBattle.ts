import { BattleStateSchema } from "../../state";
import { BattleType } from "retrommo-types";
import { State } from "pixel-pigeon";
import { getBattleState } from "../state/getBattleState";

export const canFleeBattle = (): boolean => {
  const battleState: State<BattleStateSchema> = getBattleState();
  switch (battleState.values.type) {
    case BattleType.Boss:
      return false;
    case BattleType.Duel:
      return false;
    case BattleType.Encounter:
      return true;
  }
};
