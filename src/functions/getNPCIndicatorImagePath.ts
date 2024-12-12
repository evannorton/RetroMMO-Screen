import { NPC } from "../classes/NPC";
import { QuestGiverQuest } from "../classes/QuestGiver";
import { QuestState } from "../types/QuestState";
import { getDefinable } from "definables";
import { getQuestPartyState } from "./getQuestPartyState";

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
    const questStates: readonly (QuestState | null)[] =
      npc.questGiver.quests.map(
        (questGiverQuest: QuestGiverQuest): QuestState | null =>
          getQuestPartyState(questGiverQuest.questID),
      );
    if (questStates.includes(QuestState.TurnIn)) {
      return "indicators/quest/turn-in";
    }
    if (questStates.includes(QuestState.Accept)) {
      return "indicators/quest/accept";
    }
    if (questStates.includes(QuestState.InProgress)) {
      return "indicators/quest/in-progress";
    }
  }
  if (npc.hasDialogue() || npc.hasQuestGiver()) {
    return "indicators/dialogue";
  }
  throw new Error("No indicator image path found for NPC.");
};
