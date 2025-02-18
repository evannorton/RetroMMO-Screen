import { BattleExitToWorldUpdate, ItemInstanceUpdate } from "retrommo-types";
import { createWorldState } from "../state/createWorldState";
import { listenToSocketioEvent } from "pixel-pigeon";
import { loadWorldBagItemInstanceUpdate } from "../load-updates/loadWorldBagItemInstanceUpdate";
import { loadWorldCharacterUpdate } from "../load-updates/loadWorldCharacterUpdate";
import { loadWorldNPCUpdate } from "../load-updates/loadWorldNPCUpdate";
import { loadWorldPartyUpdate } from "../load-updates/loadWorldPartyUpdate";
import { selectWorldCharacter } from "../selectWorldCharacter";
import { state } from "../../state";

export const listenForBattleUpdates = (): void => {
  listenToSocketioEvent<BattleExitToWorldUpdate>({
    event: "battle/exit-to-world",
    onMessage: (update: BattleExitToWorldUpdate): void => {
      state.setValues({
        battleState: null,
        worldState: createWorldState(
          update.bagItemInstances.map(
            (bagItemInstance: ItemInstanceUpdate): string => bagItemInstance.id,
          ),
          update.inventoryGold,
          update.worldCharacterID,
        ),
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
        loadWorldBagItemInstanceUpdate(bagItemInstanceUpdate);
      }
      selectWorldCharacter(update.worldCharacterID);
    },
  });
};
