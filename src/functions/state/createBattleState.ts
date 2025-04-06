import { BattleStateSchema } from "../../state";
import { State } from "pixel-pigeon";

export interface CreateBattleStateOptions {
  readonly enemyBattleCharacterIDs: readonly string[];
  readonly friendlyBattleCharacterIDs: readonly string[];
  readonly reachableID: string;
}
export const createBattleState = ({
  enemyBattleCharacterIDs,
  friendlyBattleCharacterIDs,
  reachableID,
}: CreateBattleStateOptions): State<BattleStateSchema> =>
  new State<BattleStateSchema>({
    enemyBattleCharacterIDs,
    friendlyBattleCharacterIDs,
    reachableID,
  });
