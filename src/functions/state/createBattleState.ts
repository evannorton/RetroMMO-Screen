import { BattleEvent, BattlePhase, BattleType } from "retrommo-types";
import {
  BattleMenuState,
  BattleStateHotkey,
  BattleStateRoundEventInstance,
  BattleStateSchema,
} from "../../state";
import { DefinableReference } from "definables";
import { HUDElementReferences, State } from "pixel-pigeon";

export interface CreateBattleStateOptionsSelection {
  readonly serverTime: number;
}
export interface CreateBattleStateOptionsRound {
  readonly duration: number;
  readonly events: readonly BattleEvent[];
  readonly isFinal: boolean;
  readonly serverTime: number;
}
export interface CreateBattleStateOptionsHotkey {
  readonly hotkeyableDefinableReference: DefinableReference;
  readonly index: number;
}
export interface CreateBattleStateOptions {
  readonly battlerID: string;
  readonly enemyBattlerIDs: readonly string[];
  readonly enemyBattlersCount: number;
  readonly friendlyBattlerIDs: readonly string[];
  readonly friendlyBattlersCount: number;
  readonly hotkeys: readonly CreateBattleStateOptionsHotkey[];
  readonly hudElementReferences: HUDElementReferences;
  readonly itemInstanceIDs: readonly string[];
  readonly phase: BattlePhase;
  readonly reachableID: string;
  readonly round?: CreateBattleStateOptionsRound;
  readonly selection?: CreateBattleStateOptionsSelection;
  readonly teamIndex: 0 | 1;
  readonly type: BattleType;
}
export const createBattleState = ({
  battlerID,
  enemyBattlerIDs,
  enemyBattlersCount,
  friendlyBattlerIDs,
  friendlyBattlersCount,
  hotkeys,
  hudElementReferences,
  itemInstanceIDs,
  phase,
  reachableID,
  round,
  selection,
  teamIndex,
  type,
}: CreateBattleStateOptions): State<BattleStateSchema> =>
  new State<BattleStateSchema>({
    battlerID,
    enemyBattlerIDs,
    enemyBattlersCount,
    friendlyBattlerIDs,
    friendlyBattlersCount,
    hotkeys: hotkeys.map(
      (hotkey: CreateBattleStateOptionsHotkey): BattleStateHotkey => ({
        hotkeyableDefinableReference: hotkey.hotkeyableDefinableReference,
        index: hotkey.index,
      }),
    ),
    hudElementReferences,
    impactAnimationSpriteIDs: [],
    isFadingOutMusic: false,
    phase,
    reachableID,
    round:
      typeof round !== "undefined"
        ? {
            duration: round.duration,
            eventInstances: round.events.map(
              (battleEvent: BattleEvent): BattleStateRoundEventInstance => ({
                event: battleEvent,
                isProcessed: false,
              }),
            ),
            isFinal: round.isFinal,
            serverTime: round.serverTime,
          }
        : null,
    selection:
      typeof selection !== "undefined"
        ? {
            abilitiesPage: 0,
            bindAction: null,
            isUsingAction: false,
            itemInstanceIDs,
            itemsPage: 0,
            menuState: BattleMenuState.Default,
            queuedAction: null,
            selectedAbilityIndex: null,
            selectedItemInstanceIndex: null,
            serverTime: selection.serverTime,
            unbindStartedAt: null,
          }
        : null,
    teamIndex,
    type,
  });
