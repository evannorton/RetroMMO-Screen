import { NPC } from "../classes/NPC";
import { QuestExchangerQuest } from "../classes/QuestExchanger";
import { QuestState } from "../types/QuestState";
import { getDefinable } from "definables";
import { getQuestExchangerQuests } from "./getQuestExchangerQuests";
import { getQuestPartyState } from "./getQuestPartyState";

export const getNPCIndicatorImagePath = (npcID: string): string => {
  const npc: NPC = getDefinable(NPC, npcID);
  if (npc.hasEncounter()) {
    return "indicators/boss";
  }
  if (npc.hasInnCost()) {
    return "indicators/inn";
  }
  if (npc.hasShop()) {
    return npc.shop.indicatorImagePath;
  }
  if (npc.hasQuestExchanger()) {
    const questStates: readonly (QuestState | null)[] = getQuestExchangerQuests(
      npc.id,
    ).map((questExchangerQuest: QuestExchangerQuest): QuestState | null =>
      getQuestPartyState(questExchangerQuest.questID, npcID),
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
  if (npc.hasDialogue() || npc.hasQuestExchanger()) {
    return "indicators/dialogue";
  }
  throw new Error("No indicator image path found for NPC.");
};
