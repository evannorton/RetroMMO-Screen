import { BattleMenuState, BattleStateSchema } from "../../state";
import { HUDElementReferences, State } from "pixel-pigeon";

export interface CreateBattleStateOptions {
  readonly battlerID: string;
  readonly enemyBattlerIDs: readonly string[];
  readonly friendlyBattlerIDs: readonly string[];
  readonly hudElementReferences: HUDElementReferences;
  readonly itemInstanceIDs: readonly string[];
  readonly reachableID: string;
}
export const createBattleState = ({
  battlerID,
  enemyBattlerIDs,
  friendlyBattlerIDs,
  hudElementReferences,
  itemInstanceIDs,
  reachableID,
}: CreateBattleStateOptions): State<BattleStateSchema> =>
  new State<BattleStateSchema>({
    abilitiesPage: 0,
    battlerID,
    enemyBattlerIDs,
    friendlyBattlerIDs,
    hudElementReferences,
    itemInstanceIDs,
    itemsPage: 0,
    menuState: BattleMenuState.Default,
    queuedAction: null,
    reachableID,
    selectedAbilityIndex: null,
    selectedItemInstanceIndex: null,
  });
