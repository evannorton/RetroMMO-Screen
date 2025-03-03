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
        agility: update.agility,
        bagItemInstanceIDs: update.bagItemInstances.map(
          (bagItemInstance: ItemInstanceUpdate): string => bagItemInstance.id,
        ),
        bodyItemInstanceID: update.bodyItemInstance?.id,
        boostItemInstanceIDs: update.boostItemInstances.map(
          (boostItemInstance: ItemInstanceUpdate): string =>
            boostItemInstance.id,
        ),
        clothesDyeItemInstanceID: update.clothesDyeItemInstance?.id,
        defense: update.defense,
        experienceUntilLevel: update.experienceUntilLevel,
        hairDyeItemInstanceID: update.hairDyeItemInstance?.id,
        headItemInstanceID: update.headItemInstance?.id,
        intelligence: update.intelligence,
        inventoryGold: update.inventoryGold,
        luck: update.luck,
        mainHandItemInstanceID: update.mainHandItemInstance?.id,
        maskItemInstanceID: update.maskItemInstance?.id,
        offHandItemInstanceID: update.offHandItemInstance?.id,
        outfitItemInstanceID: update.outfitItemInstance?.id,
        strength: update.strength,
        timePlayed: update.timePlayed,
        wisdom: update.wisdom,
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
      for (const boostItemInstanceUpdate of update.boostItemInstances) {
        loadItemInstanceUpdate(boostItemInstanceUpdate);
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
      if (typeof update.clothesDyeItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.clothesDyeItemInstance);
      }
      if (typeof update.hairDyeItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.hairDyeItemInstance);
      }
      if (typeof update.maskItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.maskItemInstance);
      }
      if (typeof update.outfitItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.outfitItemInstance);
      }
      selectWorldCharacter(update.worldCharacterID);
    },
  });
};
