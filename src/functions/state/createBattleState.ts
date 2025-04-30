import { BattleStateSchema } from "../../state";
import { HUDElementReferences, State } from "pixel-pigeon";

export interface CreateBattleStateOptions {
  readonly enemyBattleCharacterIDs: readonly string[];
  readonly friendlyBattleCharacterIDs: readonly string[];
  readonly hudElementReferences: HUDElementReferences;
  readonly reachableID: string;
}
export const createBattleState = ({
  enemyBattleCharacterIDs,
  friendlyBattleCharacterIDs,
  hudElementReferences,
  reachableID,
}: CreateBattleStateOptions): State<BattleStateSchema> =>
  new State<BattleStateSchema>({
    enemyBattleCharacterIDs,
    friendlyBattleCharacterIDs,
    hudElementReferences,
    reachableID,
    selectedAction: null,
  });
