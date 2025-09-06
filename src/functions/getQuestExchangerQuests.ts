import { NPC } from "../classes/NPC";
import { Quest } from "../classes/Quest";
import { QuestExchangerQuest } from "../classes/QuestExchanger";
import { QuestState } from "../types/QuestState";
import { getDefinable } from "definables";
import { getQuestState } from "./getQuestState";

export const getQuestExchangerQuests = (
  npcID: string,
): readonly QuestExchangerQuest[] => {
  const npc: NPC = getDefinable(NPC, npcID);
  return npc.questExchanger.quests.filter(
    (questExchangerQuest: QuestExchangerQuest): boolean => {
      const quest: Quest = getDefinable(Quest, questExchangerQuest.questID);
      if (
        questExchangerQuest.isGiver === false &&
        getQuestState(questExchangerQuest.questID, npcID) === null
      ) {
        return false;
      }
      if (quest.hasPrerequisiteQuest()) {
        if (getQuestState(quest.prerequisiteQuestID) !== QuestState.Complete) {
          return false;
        }
      }
      return true;
    },
  );
};
