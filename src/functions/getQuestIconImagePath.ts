import { Quest } from "../classes/Quest";
import { getDefinable } from "definables";

export const getQuestIconImagePath = (questID: string): string => {
  const quest: Quest = getDefinable(Quest, questID);
  if (quest.hasMonster()) {
    return "quest-icons/monsters";
  }
  throw new Error("Quest does not have an icon");
};
