import {
  BattleCancelSubmittedMoveUpdate,
  BattleEndRoundUpdate,
  BattleEvent,
  BattlePhase,
  BattleStartRoundUpdate,
  BattleSubmitAbilityUpdate,
  BattleSubmitItemUpdate,
  ItemInstanceUpdate,
} from "retrommo-types";
import { BattleCharacter } from "../../classes/BattleCharacter";
import { BattleStateRoundEventInstance, BattleStateSchema } from "../../state";
import { Battler } from "../../classes/Battler";
import { ItemInstance } from "../../classes/ItemInstance";
import { State, listenToSocketioEvent } from "pixel-pigeon";
import { getBattleState } from "../state/getBattleState";
import { getDefinable, getDefinables } from "definables";
import { loadBattleSubmittedAbilityUpdate } from "../load-updates/loadBattleSubmittedAbilityUpdate";
import { loadBattleSubmittedItemUpdate } from "../load-updates/loadBattleSubmittedItemUpdate";
import { loadItemInstanceUpdate } from "../load-updates/loadItemInstanceUpdate";

export const listenForBattleUpdates = (): void => {
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
        if (battleState.values.friendlyBattlerIDs.includes(battlerUpdate.id)) {
          if (typeof battlerUpdate.resources === "undefined") {
            throw new Error(
              `BattleEndRoundUpdate: Battler ${battlerUpdate.id} resources are undefined`,
            );
          }
          const battler: Battler = getDefinable(Battler, battlerUpdate.id);
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
};
