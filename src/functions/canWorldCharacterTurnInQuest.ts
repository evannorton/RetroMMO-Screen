import { Quest } from "../classes/Quest";
import {
  WorldCharacter,
  WorldCharacterQuestInstance,
} from "../classes/WorldCharacter";
import { getDefinable } from "definables";

export const canWorldCharacterTurnInQuest = (
  worldCharacterID: string,
  questID: string,
): boolean => {
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldCharacterID,
  );
  const questInstance: WorldCharacterQuestInstance | undefined =
    worldCharacter.questInstances[questID];
  if (typeof questInstance === "undefined") {
    return false;
  }
  const quest: Quest = getDefinable(Quest, questID);
  if (typeof questInstance.monsterKills !== "undefined") {
    if (questInstance.monsterKills < quest.monster.kills) {
      return false;
    }
  }
  return true;
};
