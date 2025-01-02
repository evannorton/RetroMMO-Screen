import { NPC } from "../classes/NPC";
import { Quest } from "../classes/Quest";
import { QuestGiverQuest } from "../classes/QuestGiver";
import { QuestState } from "../types/QuestState";
import { getDefinable } from "definables";
import { getQuestState } from "./getQuestState";

export const getQuestGiverQuests = (
  npcID: string,
): readonly QuestGiverQuest[] => {
  const npc: NPC = getDefinable(NPC, npcID);
  return npc.questGiver.quests.filter(
    (questGiverQuest: QuestGiverQuest): boolean => {
      const quest: Quest = getDefinable(Quest, questGiverQuest.questID);
      if (quest.hasPrerequisiteQuest()) {
        if (getQuestState(quest.prerequisiteQuestID) !== QuestState.Complete) {
          return false;
        }
      }
      return true;
    },
  );
};
