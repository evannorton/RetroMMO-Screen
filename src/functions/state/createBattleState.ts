import { BattleEvent, BattlePhase, BattleType } from "retrommo-types";
import {
  BattleMenuState,
  BattleStateHotkey,
  BattleStateRoundEventInstance,
  BattleStateSchema,
} from "../../state";
import { DefinableReference } from "definables";
import { HUDElementReferences, State } from "pixel-pigeon";

export interface CreateBattleStateOptionsRound {
  readonly events: readonly BattleEvent[];
  readonly serverTime: number;
}
export interface CreateBattleStateOptionsHotkey {
  readonly hotkeyableDefinableReference: DefinableReference;
  readonly index: number;
}
export interface CreateBattleStateOptions {
  readonly battlerID: string;
  readonly enemyBattlerIDs: readonly string[];
  readonly friendlyBattlerIDs: readonly string[];
  readonly hotkeys: readonly CreateBattleStateOptionsHotkey[];
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
  hotkeys,
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
    bindAction: null,
    enemyBattlerIDs,
    friendlyBattlerIDs,
    hotkeys: hotkeys.map(
      (hotkey: CreateBattleStateOptionsHotkey): BattleStateHotkey => ({
        hotkeyableDefinableReference: hotkey.hotkeyableDefinableReference,
        index: hotkey.index,
      }),
    ),
    hudElementReferences,
    impactAnimationSpriteIDs: [],
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
    unbindStartedAt: null,
  });
