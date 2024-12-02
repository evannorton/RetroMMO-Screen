import { NPC } from "../classes/NPC";
import { QuestState } from "../types/QuestState";
import { getDefinable } from "definables";
import { getQuestState } from "./getQuestState";

export const getNPCIndicatorImagePath = (npcID: string): string => {
  const npc: NPC = getDefinable(NPC, npcID);
  if (npc.hasEncounterID()) {
    return "indicators/boss";
  }
  if (npc.hasInnCost()) {
    return "indicators/inn";
  }
  if (npc.hasShopID()) {
    return npc.shop.indicatorImagePath;
  }
  if (npc.hasQuestGiver()) {
    for (const questGiverQuest of npc.questGiver.quests) {
      switch (getQuestState(questGiverQuest.questID)) {
        case QuestState.Accept:
          return "indicators/quest/accept";
        case QuestState.InProgress:
          return "indicators/quest/in-progress";
        case QuestState.TurnIn:
          return "indicators/quest/turn-in";
      }
    }
  }
  if (npc.hasDialogue() || npc.hasQuestGiver()) {
    return "indicators/dialogue";
  }
  throw new Error("No indicator image path found for NPC.");
};
