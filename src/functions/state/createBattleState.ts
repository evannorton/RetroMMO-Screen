import { BattleEvent, BattlePhase, BattleType } from "retrommo-types";
import {
  BattleMenuState,
  BattleStateRoundEventInstance,
  BattleStateSchema,
} from "../../state";
import { HUDElementReferences, State } from "pixel-pigeon";

export interface CreateBattleStateOptionsRound {
  readonly events: readonly BattleEvent[];
  readonly serverTime: number;
}
export interface CreateBattleStateOptions {
  readonly battlerID: string;
  readonly enemyBattlerIDs: readonly string[];
  readonly friendlyBattlerIDs: readonly string[];
  readonly hudElementReferences: HUDElementReferences;
  readonly itemInstanceIDs: readonly string[];
  readonly phase: BattlePhase;
  readonly reachableID: string;
  readonly round?: CreateBattleStateOptionsRound;
  readonly type: BattleType;
}
export const createBattleState = ({
  battlerID,
  enemyBattlerIDs,
  friendlyBattlerIDs,
  hudElementReferences,
  itemInstanceIDs,
  phase,
  reachableID,
  round,
  type,
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
    phase,
    queuedAction: null,
    reachableID,
    round:
      typeof round !== "undefined"
        ? {
            eventInstances: round.events.map(
              (battleEvent: BattleEvent): BattleStateRoundEventInstance => ({
                event: battleEvent,
                isProcessed: false,
              }),
            ),
            serverTime: round.serverTime,
          }
        : null,
    selectedAbilityIndex: null,
    selectedItemInstanceIndex: null,
    type,
  });
