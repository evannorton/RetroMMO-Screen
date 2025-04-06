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
  for (const partyPlayer of worldCharacter.player.character.party.players) {
    const questInstances: Record<string, WorldCharacterQuestInstance> =
      partyPlayer.worldCharacter.questInstances;
    const questInstance: WorldCharacterQuestInstance | undefined =
      questInstances[questID];
    if (
      typeof questInstance !== "undefined" &&
      questInstance.isCompleted === false &&
      canWorldCharacterTurnInQuest(partyPlayer.worldCharacterID, questID)
    ) {
      return QuestState.TurnIn;
    }
  }
  for (const partyPlayer of worldCharacter.player.character.party.players) {
    const questInstances: Record<string, WorldCharacterQuestInstance> =
      partyPlayer.worldCharacter.questInstances;
    const questInstance: WorldCharacterQuestInstance | undefined =
      questInstances[questID];
    if (typeof questInstance === "undefined") {
      return QuestState.Accept;
    }
  }
  for (const partyPlayer of worldCharacter.player.character.party.players) {
    const questInstances: Record<string, WorldCharacterQuestInstance> =
      partyPlayer.worldCharacter.questInstances;
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
  for (const partyPlayer of worldCharacter.player.character.party.players) {
    const questInstances: Record<string, WorldCharacterQuestInstance> =
      partyPlayer.worldCharacter.questInstances;
    const questInstance: WorldCharacterQuestInstance | undefined =
      questInstances[questID];
    if (typeof questInstance !== "undefined" && questInstance.isCompleted) {
      return QuestState.Complete;
    }
  }
  return null;
};
