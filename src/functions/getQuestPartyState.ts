import { NPC } from "../classes/NPC";
import { QuestExchangerQuest } from "../classes/QuestExchanger";
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

export const getQuestPartyState = (
  questID: string,
  npcID?: string,
): QuestState | null => {
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
      canWorldCharacterTurnInQuest(partyPlayer.worldCharacterID, questID, npcID)
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
      if (typeof npcID === "undefined") {
        return QuestState.Accept;
      }
      const npc: NPC = getDefinable(NPC, npcID);
      const matchedQuestExchangerQuest: QuestExchangerQuest | undefined =
        npc.questExchanger.quests.find(
          (questExchangerQuest: QuestExchangerQuest): boolean =>
            questExchangerQuest.questID === questID,
        );
      if (typeof matchedQuestExchangerQuest === "undefined") {
        throw new Error("Quest exchanger quest not found");
      }
      if (matchedQuestExchangerQuest.isGiver) {
        return QuestState.Accept;
      }
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
