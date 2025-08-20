import { QuestState } from "../types/QuestState";
import { State } from "pixel-pigeon";
import {
  WorldCharacter,
  WorldCharacterQuestInstance,
} from "../classes/WorldCharacter";
import { WorldStateSchema } from "../state";
import { canWorldCharacterTurnInQuest } from "./canWorldCharacterTurnInQuest";
import { getDefinable } from "definables";
import { getWorldState } from "./state/getWorldState";

export const getQuestState = (
  questID: string,
  npcID?: string,
): QuestState | null => {
  console.log(npcID);
  const worldState: State<WorldStateSchema> = getWorldState();
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldState.values.worldCharacterID,
  );
  const questInstances: Record<string, WorldCharacterQuestInstance> =
    worldCharacter.questInstances;
  const questInstance: WorldCharacterQuestInstance | undefined =
    questInstances[questID];
  if (
    typeof questInstance !== "undefined" &&
    questInstance.isCompleted === false &&
    canWorldCharacterTurnInQuest(worldCharacter.id, questID, npcID)
  ) {
    return QuestState.TurnIn;
  }
  if (typeof questInstance === "undefined") {
    return QuestState.Accept;
  }
  if (
    typeof questInstance !== "undefined" &&
    questInstance.isStarted &&
    questInstance.isCompleted === false
  ) {
    return QuestState.InProgress;
  }
  if (typeof questInstance !== "undefined" && questInstance.isCompleted) {
    return QuestState.Complete;
  }
  return null;
};
