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

export const getQuestPartyState = (questID: string): QuestState | null => {
  const worldState: State<WorldStateSchema> = getWorldState();
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldState.values.worldCharacterID,
  );
  for (const partyWorldCharacter of worldCharacter.party.worldCharacters) {
    const questInstances: Record<string, WorldCharacterQuestInstance> =
      partyWorldCharacter.questInstances;
    const questInstance: WorldCharacterQuestInstance | undefined =
      questInstances[questID];
    if (typeof questInstance !== "undefined" && questInstance.isCompleted) {
      return QuestState.Complete;
    }
  }
  for (const partyWorldCharacter of worldCharacter.party.worldCharacters) {
    const questInstances: Record<string, WorldCharacterQuestInstance> =
      partyWorldCharacter.questInstances;
    const questInstance: WorldCharacterQuestInstance | undefined =
      questInstances[questID];
    if (
      typeof questInstance !== "undefined" &&
      questInstance.isCompleted === false &&
      canWorldCharacterTurnInQuest(partyWorldCharacter.id, questID)
    ) {
      return QuestState.TurnIn;
    }
  }
  for (const partyWorldCharacter of worldCharacter.party.worldCharacters) {
    const questInstances: Record<string, WorldCharacterQuestInstance> =
      partyWorldCharacter.questInstances;
    const questInstance: WorldCharacterQuestInstance | undefined =
      questInstances[questID];
    if (typeof questInstance === "undefined") {
      return QuestState.Accept;
    }
  }
  for (const partyWorldCharacter of worldCharacter.party.worldCharacters) {
    const questInstances: Record<string, WorldCharacterQuestInstance> =
      partyWorldCharacter.questInstances;
    const questInstance: WorldCharacterQuestInstance | undefined =
      questInstances[questID];
    if (
      typeof questInstance !== "undefined" &&
      questInstance.isStarted &&
      questInstance.isCompleted === false
    ) {
      return QuestState.InProgress;
    }
  }
  return null;
};
