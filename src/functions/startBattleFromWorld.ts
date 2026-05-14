import { Ability } from "../classes/Ability";
import {
  BattlePhase,
  ItemInstanceUpdate,
  WorldStartBattleUpdate,
} from "retrommo-types";
import { BattleStateSchema, state } from "../state";
import { Battler } from "../classes/Battler";
import {
  CreateBattleStateOptionsHotkey,
  createBattleState,
} from "./state/createBattleState";
import { Item } from "../classes/Item";
import {
  State,
  exitLevel,
  setTilemapDownsampleScale,
  stopPixelScatter,
} from "pixel-pigeon";
import { WorldCharacter } from "../classes/WorldCharacter";
import { createBattleUI } from "./ui/battle/createBattleUI";
import { definableExists, getDefinable, getDefinables } from "definables";

export const startBattleFromWorld = (
  worldStartBattleUpdate: WorldStartBattleUpdate,
): void => {
  setTilemapDownsampleScale(1);
  stopPixelScatter();
  const hotkeys: CreateBattleStateOptionsHotkey[] = [];
  for (const abilityHotkey of worldStartBattleUpdate.abilityHotkeys) {
    hotkeys.push({
      hotkeyableDefinableReference: getDefinable(
        Ability,
        abilityHotkey.abilityID,
      ).getReference(),
      index: abilityHotkey.index,
    });
  }
  for (const itemHotkey of worldStartBattleUpdate.itemHotkeys) {
    hotkeys.push({
      hotkeyableDefinableReference: getDefinable(
        Item,
        itemHotkey.itemID,
      ).getReference(),
      index: itemHotkey.index,
    });
  }
  const battleState: State<BattleStateSchema> = createBattleState({
    battlerID: worldStartBattleUpdate.battlerID,
    encounterID: worldStartBattleUpdate.encounterID,
    enemyBattlerIDs: worldStartBattleUpdate.enemyBattlerIDs,
    enemyBattlersCount: worldStartBattleUpdate.enemyBattlersCount,
    friendlyBattlerIDs: worldStartBattleUpdate.friendlyBattlerIDs,
    friendlyBattlersCount: worldStartBattleUpdate.friendlyBattlersCount,
    hotkeys,
    hudElementReferences: createBattleUI({
      enemyBattlerIDs: worldStartBattleUpdate.enemyBattlerIDs.filter(
        (battlerID: string): boolean => definableExists(Battler, battlerID),
      ),
      friendlyBattlerIDs: worldStartBattleUpdate.friendlyBattlerIDs.filter(
        (battlerID: string): boolean => definableExists(Battler, battlerID),
      ),
    }),
    itemInstanceIDs: worldStartBattleUpdate.itemInstances.map(
      (itemInstanceUpdate: ItemInstanceUpdate): string =>
        itemInstanceUpdate.itemInstanceID,
    ),
    phase: BattlePhase.Round,
    reachableID: worldStartBattleUpdate.reachableID,
    round: {
      duration: worldStartBattleUpdate.round.duration,
      events: worldStartBattleUpdate.round.events,
      isFinal: worldStartBattleUpdate.round.isFinal ?? false,
      serverTime: worldStartBattleUpdate.round.serverTime,
    },
    teamIndex: worldStartBattleUpdate.teamIndex,
    type: worldStartBattleUpdate.battleType,
  });
  state.setValues({
    battleState,
    worldState: null,
  });
  for (const worldCharacter of getDefinables(WorldCharacter).values()) {
    worldCharacter.player.worldCharacterID = null;
    worldCharacter.remove();
  }
  exitLevel();
};
