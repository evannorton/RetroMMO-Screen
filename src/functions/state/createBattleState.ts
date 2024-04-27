import { BattleStateSchema } from "../../state";
import { State } from "pixel-pigeon";

export const createBattleState = (): State<BattleStateSchema> =>
  new State<BattleStateSchema>({});
