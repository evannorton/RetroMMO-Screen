import {
  BattleBindAbilityUpdate,
  BattleBindItemUpdate,
  BattleCancelSubmittedMoveUpdate,
  BattleEndRoundUpdate,
  BattleEvent,
  BattlePhase,
  BattleStartRoundUpdate,
  BattleSubmitAbilityUpdate,
  BattleSubmitItemUpdate,
  BattleUnbindHotkeyUpdate,
  ItemInstanceUpdate,
} from "retrommo-types";
import { BattleCharacter } from "../../classes/BattleCharacter";
import {
  BattleMenuState,
  BattleStateHotkey,
  BattleStateRoundEventInstance,
  BattleStateSchema,
} from "../../state";
import { Battler } from "../../classes/Battler";
import { ItemInstance } from "../../classes/ItemInstance";
import { State, listenToSocketioEvent } from "pixel-pigeon";
import { getBattleState } from "../state/getBattleState";
import { getDefinable, getDefinables } from "definables";
import { loadBattleSubmittedAbilityUpdate } from "../load-updates/loadBattleSubmittedAbilityUpdate";
import { loadBattleSubmittedItemUpdate } from "../load-updates/loadBattleSubmittedItemUpdate";
import { loadItemInstanceUpdate } from "../load-updates/loadItemInstanceUpdate";

export const listenForBattleUpdates = (): void => {
  listenToSocketioEvent<BattleBindAbilityUpdate>({
    event: "battle/bind-ability",
    onMessage: (update: BattleBindAbilityUpdate): void => {
      const battleState: State<BattleStateSchema> = getBattleState();
      const filteredHotkeys: readonly BattleStateHotkey[] =
        battleState.values.hotkeys.filter(
          (hotkey: BattleStateHotkey): boolean => hotkey.index !== update.index,
        );
      battleState.setValues({
        hotkeys: [
          ...filteredHotkeys,
          {
            hotkeyableDefinableReference: {
              className: "Ability",
              id: update.abilityID,
            },
            index: update.index,
          },
        ],
      });
    },
  });
  listenToSocketioEvent<BattleBindItemUpdate>({
    event: "battle/bind-item",
    onMessage: (update: BattleBindItemUpdate): void => {
      const battleState: State<BattleStateSchema> = getBattleState();
      const filteredHotkeys: readonly BattleStateHotkey[] =
        battleState.values.hotkeys.filter(
          (hotkey: BattleStateHotkey): boolean => hotkey.index !== update.index,
        );
      battleState.setValues({
        hotkeys: [
          ...filteredHotkeys,
          {
            hotkeyableDefinableReference: {
              className: "Item",
              id: update.itemID,
            },
            index: update.index,
          },
        ],
      });
    },
  });
  listenToSocketioEvent<BattleCancelSubmittedMoveUpdate>({
    event: "battle/cancel-submitted-move",
    onMessage: (update: BattleCancelSubmittedMoveUpdate): void => {
      const battler: Battler = getDefinable(Battler, update.battlerID);
      battler.battleCharacter.submittedMove = null;
    },
  });
  listenToSocketioEvent<BattleEndRoundUpdate>({
    event: "battle/end-round",
    onMessage: (update: BattleEndRoundUpdate): void => {
      for (const itemInstance of getDefinables(ItemInstance).values()) {
        itemInstance.remove();
      }
      for (const itemInstanceUpdate of update.itemInstances) {
        loadItemInstanceUpdate(itemInstanceUpdate);
      }
      const battleState: State<BattleStateSchema> = getBattleState();
      battleState.setValues({
        itemInstanceIDs: update.itemInstances.map(
          (itemInstanceUpdate: ItemInstanceUpdate): string =>
            itemInstanceUpdate.itemInstanceID,
        ),
        phase: BattlePhase.Selection,
        round: null,
      });
      for (const battlerUpdate of update.battlers) {
        const battler: Battler = getDefinable(Battler, battlerUpdate.id);
        battler.isAlive = battlerUpdate.isAlive ?? false;
        if (battleState.values.friendlyBattlerIDs.includes(battlerUpdate.id)) {
          if (typeof battlerUpdate.resources === "undefined") {
            throw new Error(
              `BattleEndRoundUpdate: Battler ${battlerUpdate.id} resources are undefined`,
            );
          }
          battler.resources = {
            hp: battlerUpdate.resources.hp,
            maxHP: battlerUpdate.resources.maxHP,
            maxMP: battlerUpdate.resources.maxMP ?? null,
            mp: battlerUpdate.resources.mp ?? null,
          };
        }
      }
    },
  });
  listenToSocketioEvent<BattleSubmitAbilityUpdate>({
    event: "battle/submit-ability",
    onMessage: (update: BattleSubmitAbilityUpdate): void => {
      const battleState: State<BattleStateSchema> = getBattleState();
      loadBattleSubmittedAbilityUpdate(update.submittedAbility);
      if (
        update.submittedAbility.casterBattlerID === battleState.values.battlerID
      ) {
        battleState.setValues({
          queuedAction: null,
        });
      }
    },
  });
  listenToSocketioEvent<BattleStartRoundUpdate>({
    event: "battle/start-round",
    onMessage: (update: BattleStartRoundUpdate): void => {
      for (const battleCharacter of getDefinables(BattleCharacter).values()) {
        battleCharacter.submittedMove = null;
      }
      const battleState: State<BattleStateSchema> = getBattleState();
      battleState.setValues({
        abilitiesPage: 0,
        bindAction: null,
        itemsPage: 0,
        menuState: BattleMenuState.Default,
        phase: BattlePhase.Round,
        queuedAction: null,
        round: {
          eventInstances: update.round.events.map(
            (battleEvent: BattleEvent): BattleStateRoundEventInstance => ({
              event: battleEvent,
              isProcessed: false,
            }),
          ),
          serverTime: update.round.serverTime,
        },
        selectedAbilityIndex: null,
        selectedItemInstanceIndex: null,
        unbindStartedAt: null,
      });
    },
  });
  listenToSocketioEvent<BattleSubmitItemUpdate>({
    event: "battle/submit-item",
    onMessage: (update: BattleSubmitItemUpdate): void => {
      const battleState: State<BattleStateSchema> = getBattleState();
      loadBattleSubmittedItemUpdate(update.submittedItem);
      if (
        update.submittedItem.casterBattlerID === battleState.values.battlerID
      ) {
        battleState.setValues({
          queuedAction: null,
        });
      }
    },
  });
  listenToSocketioEvent<BattleUnbindHotkeyUpdate>({
    event: "battle/unbind-hotkey",
    onMessage: (update: BattleUnbindHotkeyUpdate): void => {
      const battleState: State<BattleStateSchema> = getBattleState();
      battleState.setValues({
        hotkeys: battleState.values.hotkeys.filter(
          (hotkey: BattleStateHotkey): boolean => hotkey.index !== update.index,
        ),
        unbindStartedAt: null,
      });
    },
  });
};
