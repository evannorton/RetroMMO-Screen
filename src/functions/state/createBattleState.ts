import { BattleStateSchema } from "../../state";
import { State } from "pixel-pigeon";

export interface CreateBattleStateOptions {
  readonly reachableID: string;
}
export const createBattleState = ({
  reachableID,
}: CreateBattleStateOptions): State<BattleStateSchema> =>
  new State<BattleStateSchema>({ reachableID });
