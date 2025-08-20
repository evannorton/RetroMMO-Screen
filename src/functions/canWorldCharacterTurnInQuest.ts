import { NPC } from "../classes/NPC";
import { Quest } from "../classes/Quest";
import { QuestExchangerQuest } from "../classes/QuestExchanger";
import {
  WorldCharacter,
  WorldCharacterQuestInstance,
} from "../classes/WorldCharacter";
import { getDefinable } from "definables";

export const canWorldCharacterTurnInQuest = (
  worldCharacterID: string,
  questID: string,
  npcID?: string,
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
  if (typeof npcID === "undefined") {
    return true;
  }
  const npc: NPC = getDefinable(NPC, npcID);
  const matchedQuestExchangerQuest: QuestExchangerQuest | undefined =
    npc.questExchanger.quests.find(
      (questExchangerQuest: QuestExchangerQuest): boolean =>
        questExchangerQuest.questID === questID,
    );
  if (typeof matchedQuestExchangerQuest === "undefined") {
    throw new Error("Quest exchanger quest not found");
  }
  return matchedQuestExchangerQuest.isReceiver;
};
