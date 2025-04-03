import {
  WorldCharacter,
  WorldCharacterOptionsQuestInstance,
} from "../../classes/WorldCharacter";
import {
  WorldPartyCharacterUpdate,
  WorldQuestInstanceUpdate,
} from "retrommo-types";
import { getDefinable } from "definables";
import { updateWorldCharacterOrder } from "../updateWorldCharacterOrder";

export const loadWorldPartyCharacterUpdate = (
  worldPartyCharacterUpdate: WorldPartyCharacterUpdate,
): void => {
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldPartyCharacterUpdate.characterID,
  );
  const questInstances: Record<string, WorldCharacterOptionsQuestInstance> = {};
  if (typeof worldPartyCharacterUpdate.questInstances !== "undefined") {
    for (const questID in worldPartyCharacterUpdate.questInstances) {
      const questInstance: WorldQuestInstanceUpdate | undefined =
        worldPartyCharacterUpdate.questInstances[questID];
      if (typeof questInstance === "undefined") {
        throw new Error("No quest instance.");
      }
      questInstances[questID] = {
        isCompleted: questInstance.isCompleted ?? false,
        isStarted: questInstance.isStarted ?? false,
        monsterKills: questInstance.monsterKills,
      };
    }
  }
  worldCharacter.isRenewing = worldPartyCharacterUpdate.isRenewing;
  worldCharacter.openedChestIDs = worldPartyCharacterUpdate.openedChestIDs;
  worldCharacter.resources = {
    hp: worldPartyCharacterUpdate.resources.hp,
    maxHP: worldPartyCharacterUpdate.resources.maxHP,
    maxMP: worldPartyCharacterUpdate.resources.maxMP ?? null,
    mp: worldPartyCharacterUpdate.resources.mp ?? null,
  };
  updateWorldCharacterOrder(worldCharacter.id, worldPartyCharacterUpdate.order);
};
