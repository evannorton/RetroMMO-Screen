import { BattleMenuState, BattleStateSchema } from "../../state";
import { HUDElementReferences, State } from "pixel-pigeon";

export interface CreateBattleStateOptions {
  readonly battleCharacterID: string;
  readonly enemyBattleCharacterIDs: readonly string[];
  readonly friendlyBattleCharacterIDs: readonly string[];
  readonly hudElementReferences: HUDElementReferences;
  readonly itemInstanceIDs: readonly string[];
  readonly reachableID: string;
}
export const createBattleState = ({
  battleCharacterID,
  enemyBattleCharacterIDs,
  friendlyBattleCharacterIDs,
  hudElementReferences,
  itemInstanceIDs,
  reachableID,
}: CreateBattleStateOptions): State<BattleStateSchema> =>
  new State<BattleStateSchema>({
    abilitiesPage: 0,
    battleCharacterID,
    enemyBattleCharacterIDs,
    friendlyBattleCharacterIDs,
    hudElementReferences,
    itemInstanceIDs,
    itemsPage: 0,
    menuState: BattleMenuState.Default,
    queuedAction: null,
    reachableID,
    selectedAbilityIndex: null,
    selectedItemInstanceIndex: null,
  });
