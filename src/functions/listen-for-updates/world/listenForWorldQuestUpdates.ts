import { NPC } from "../../../classes/NPC";
import { Player } from "../../../classes/Player";
import { Quest } from "../../../classes/Quest";
import { QuestExchangerQuest } from "../../../classes/QuestExchanger";
import { State, listenToSocketioEvent } from "pixel-pigeon";
import {
  WorldCharacter,
  WorldCharacterQuestInstance,
} from "../../../classes/WorldCharacter";
import {
  WorldQuestAcceptUpdate,
  WorldQuestSelectUpdate,
  WorldQuestTurnInUpdate,
  WorldQuestTurnInWorldUpdate,
} from "retrommo-types";
import { WorldStateSchema } from "../../../state";
import { canWorldCharacterTurnInQuest } from "../../canWorldCharacterTurnInQuest";
import { closeWorldMenus } from "../../world-menus/closeWorldMenus";
import { getDefinable } from "definables";
import { getWorldState } from "../../state/getWorldState";
import { npcDialogueWorldMenu } from "../../../world-menus/npcDialogueWorldMenu";

export const listenForWorldQuestUpdates = (): void => {
  listenToSocketioEvent<WorldQuestAcceptUpdate>({
    event: "world/quest/accept",
    onMessage: (update: WorldQuestAcceptUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        worldState.values.worldCharacterID,
      );
      const isLeader: boolean =
        worldCharacter.player.character.party.playerIDs[0] ===
        worldCharacter.id;
      if (npcDialogueWorldMenu.isOpen() === false) {
        closeWorldMenus();
        npcDialogueWorldMenu.open({
          isLeader,
          npcID: update.npcID,
        });
      }
      const npc: NPC = getDefinable(NPC, update.npcID);
      npcDialogueWorldMenu.state.setValues({
        questCompletion: null,
        selectedQuestIndex: npc.questExchanger.quests.findIndex(
          (questExchangerQuest: QuestExchangerQuest): boolean =>
            questExchangerQuest.questID === update.questID,
        ),
      });
      const quest: Quest = getDefinable(Quest, update.questID);
      for (const partyPlayer of worldCharacter.player.character.party.players) {
        const questInstance: WorldCharacterQuestInstance | undefined =
          partyPlayer.worldCharacter.questInstances[update.questID];
        if (typeof questInstance === "undefined") {
          let isBlockedByPrereq: boolean = false;
          if (quest.hasPrerequisiteQuest()) {
            const prereqQuestInstance: WorldCharacterQuestInstance | undefined =
              partyPlayer.worldCharacter.questInstances[
                quest.prerequisiteQuestID
              ];
            if (
              typeof prereqQuestInstance === "undefined" ||
              prereqQuestInstance.isCompleted === false
            ) {
              isBlockedByPrereq = true;
            }
          }
          if (isBlockedByPrereq === false) {
            partyPlayer.worldCharacter.questInstances[update.questID] = {
              isCompleted: false,
              isStarted: true,
              monsterKills: quest.hasMonster() ? 0 : undefined,
            };
          }
        }
      }
    },
  });
  listenToSocketioEvent<WorldQuestSelectUpdate>({
    event: "world/quest/select",
    onMessage: (update: WorldQuestSelectUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        worldState.values.worldCharacterID,
      );
      const isLeader: boolean =
        worldCharacter.player.character.party.playerIDs[0] ===
        worldCharacter.playerID;
      if (npcDialogueWorldMenu.isOpen() === false) {
        closeWorldMenus();
        npcDialogueWorldMenu.open({
          isLeader,
          npcID: update.npcID,
        });
      }
      const npc: NPC = getDefinable(NPC, update.npcID);
      npcDialogueWorldMenu.state.setValues({
        questCompletion: null,
        selectedQuestIndex:
          typeof update.questID !== "undefined"
            ? npc.questExchanger.quests.findIndex(
                (questExchangerQuest: QuestExchangerQuest): boolean =>
                  questExchangerQuest.questID === update.questID,
              )
            : null,
      });
    },
  });
  listenToSocketioEvent<WorldQuestTurnInUpdate>({
    event: "world/quest/turn-in",
    onMessage: (update: WorldQuestTurnInUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        worldState.values.worldCharacterID,
      );
      const previousLevel: number = worldCharacter.player.character.level;
      for (const playerUpdate of update.players) {
        const player: Player = getDefinable(Player, playerUpdate.playerID);
        player.character = {
          classID: player.character.classID,
          level: playerUpdate.level,
          partyID: player.character.partyID,
        };
      }
      const didLevelUp: boolean =
        worldCharacter.player.character.level !== previousLevel;
      if (typeof update.world !== "undefined") {
        const worldUpdate: WorldQuestTurnInWorldUpdate = update.world;
        const isLeader: boolean =
          worldCharacter.player.character.party.playerIDs[0] ===
          worldCharacter.playerID;
        if (npcDialogueWorldMenu.isOpen() === false) {
          closeWorldMenus();
          npcDialogueWorldMenu.open({
            isLeader,
            npcID: worldUpdate.npcID,
          });
        }
        for (const worldCharacterUpdate of worldUpdate.characters) {
          const partyWorldCharacter: WorldCharacter = getDefinable(
            WorldCharacter,
            worldCharacterUpdate.characterID,
          );
          partyWorldCharacter.resources = {
            hp: worldCharacterUpdate.resources.hp,
            maxHP: worldCharacterUpdate.resources.maxHP,
            maxMP: worldCharacterUpdate.resources.maxMP ?? null,
            mp: worldCharacterUpdate.resources.mp ?? null,
          };
        }
        const npc: NPC = getDefinable(NPC, worldUpdate.npcID);
        npcDialogueWorldMenu.state.setValues({
          selectedQuestIndex:
            typeof worldUpdate.questID !== "undefined"
              ? npc.questExchanger.quests.findIndex(
                  (questExchangerQuest: QuestExchangerQuest): boolean =>
                    questExchangerQuest.questID === worldUpdate.questID,
                )
              : null,
        });
        const quest: Quest = getDefinable(Quest, worldUpdate.questID);
        for (const partyPlayer of worldCharacter.player.character.party
          .players) {
          const questInstance: WorldCharacterQuestInstance | undefined =
            partyPlayer.worldCharacter.questInstances[worldUpdate.questID];
          if (typeof questInstance !== "undefined") {
            if (
              canWorldCharacterTurnInQuest(
                partyPlayer.worldCharacterID,
                quest.id,
                npc.id,
              )
            ) {
              if (questInstance.isCompleted === false) {
                npcDialogueWorldMenu.state.setValues({
                  questCompletion: {
                    didLevelUp,
                    questID: quest.id,
                  },
                  selectedQuestIndex: null,
                });
                questInstance.isCompleted = true;
              }
            }
          }
        }
        worldState.setValues({
          experienceUntilLevel: worldUpdate.experienceUntilLevel,
        });
      }
    },
  });
};
