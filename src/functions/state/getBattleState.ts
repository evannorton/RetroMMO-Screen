import { BattleStateSchema, state } from "../../state";
import { State } from "pixel-pigeon";

export const getBattleState = (): State<BattleStateSchema> => {
  if (state.values.battleState === null) {
    throw new Error("battleState is null");
  }
  return state.values.battleState;
};
