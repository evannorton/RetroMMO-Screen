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
    worldPartyCharacterUpdate.worldCharacterID,
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
  worldCharacter.resources = {
    hp: worldPartyCharacterUpdate.resources.hp,
    maxHP: worldPartyCharacterUpdate.resources.maxHP,
    maxMP: worldPartyCharacterUpdate.resources.maxMP ?? null,
    mp: worldPartyCharacterUpdate.resources.mp ?? null,
  };
  worldCharacter.openedChestIDs = worldPartyCharacterUpdate.openedChestIDs;
  updateWorldCharacterOrder(worldCharacter.id, worldPartyCharacterUpdate.order);
};
