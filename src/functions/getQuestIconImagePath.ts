import { Quest } from "../classes/Quest";
import { QuestState } from "../types/QuestState";
import { getDefinable } from "definables";
import { getQuestPartyState } from "./getQuestPartyState";

export const getQuestIconImagePath = (
  questID: string,
  npcID?: string,
): string => {
  const quest: Quest = getDefinable(Quest, questID);
  const state: QuestState | null = getQuestPartyState(questID, npcID);
  if (state === QuestState.Complete) {
    return "quest-icons/complete";
  }
  if (quest.hasMonster()) {
    return "quest-icons/monsters";
  }
  return "quest-icons/dialogue";
};
