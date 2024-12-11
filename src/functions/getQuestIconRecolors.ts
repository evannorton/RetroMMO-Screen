import { Color } from "retrommo-types";
import { CreateSpriteOptionsRecolor } from "pixel-pigeon";
import { QuestState } from "../types/QuestState";
import { getQuestPartyState } from "./getQuestPartyState";
import { getQuestState } from "./getQuestState";

export const getQuestIconRecolors = (
  questID: string,
  usePartyState: boolean,
): CreateSpriteOptionsRecolor[] => {
  let toColor: Color | undefined;
  switch (
    usePartyState ? getQuestPartyState(questID) : getQuestState(questID)
  ) {
    case QuestState.InProgress:
      toColor = Color.DarkGray;
      break;
    case QuestState.TurnIn:
      toColor = Color.StrongLimeGreen;
      break;
  }
  if (typeof toColor === "undefined") {
    throw new Error("No recolor found for quest state.");
  }
  return [
    {
      fromColor: Color.White,
      toColor,
    },
  ];
};
