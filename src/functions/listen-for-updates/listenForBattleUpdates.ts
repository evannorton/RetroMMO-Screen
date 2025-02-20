import { BattleExitToWorldUpdate, ItemInstanceUpdate } from "retrommo-types";
import { State, listenToSocketioEvent } from "pixel-pigeon";
import { WorldStateSchema, state } from "../../state";
import { createWorldState } from "../state/createWorldState";
import { loadItemInstanceUpdate } from "../load-updates/loadItemInstanceUpdate";
import { loadWorldCharacterUpdate } from "../load-updates/loadWorldCharacterUpdate";
import { loadWorldNPCUpdate } from "../load-updates/loadWorldNPCUpdate";
import { loadWorldPartyUpdate } from "../load-updates/loadWorldPartyUpdate";
import { selectWorldCharacter } from "../selectWorldCharacter";

export const listenForBattleUpdates = (): void => {
  listenToSocketioEvent<BattleExitToWorldUpdate>({
    event: "battle/exit-to-world",
    onMessage: (update: BattleExitToWorldUpdate): void => {
      const worldState: State<WorldStateSchema> = createWorldState({
        bagItemInstanceIDs: update.bagItemInstances.map(
          (bagItemInstance: ItemInstanceUpdate): string => bagItemInstance.id,
        ),
        bodyItemInstanceID: update.bodyItemInstance?.id,
        headItemInstanceID: update.headItemInstance?.id,
        inventoryGold: update.inventoryGold,
        mainHandItemInstanceID: update.mainHandItemInstance?.id,
        offHandItemInstanceID: update.offHandItemInstance?.id,
        worldCharacterID: update.worldCharacterID,
      });
      state.setValues({
        battleState: null,
        worldState,
      });
      for (const characterUpdate of update.worldCharacters) {
        loadWorldCharacterUpdate(characterUpdate);
      }
      for (const partyUpdate of update.parties) {
        loadWorldPartyUpdate(partyUpdate);
      }
      for (const npcUpdate of update.npcs) {
        loadWorldNPCUpdate(npcUpdate);
      }
      for (const bagItemInstanceUpdate of update.bagItemInstances) {
        loadItemInstanceUpdate(bagItemInstanceUpdate);
      }
      if (typeof update.bodyItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.bodyItemInstance);
      }
      if (typeof update.headItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.headItemInstance);
      }
      if (typeof update.mainHandItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.mainHandItemInstance);
      }
      if (typeof update.offHandItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.offHandItemInstance);
      }
      selectWorldCharacter(update.worldCharacterID);
    },
  });
};
