import { Bank } from "../../classes/Bank";
import { Chest } from "../../classes/Chest";
import {
  Constants,
  Direction,
  VanitySlot,
  WorldAcceptQuestUpdate,
  WorldBonkUpdate,
  WorldClearMarkerUpdate,
  WorldCloseBankUpdate,
  WorldEmoteUpdate,
  WorldEnterCharactersUpdate,
  WorldExitCharactersUpdate,
  WorldExitToMainMenuUpdate,
  WorldMarkerUpdate,
  WorldMoveCharactersUpdate,
  WorldOpenBankUpdate,
  WorldOpenChestUpdate,
  WorldPartyChangesUpdate,
  WorldPianoKeyUpdate,
  WorldPositionUpdate,
  WorldPreparationUpdate,
  WorldSelectQuestUpdate,
  WorldStartBattleUpdate,
  WorldTradeUpdate,
  WorldTurnCharactersUpdate,
  WorldTurnInQuestUpdate,
  WorldTurnNPCUpdate,
  WorldVanityUpdate,
} from "retrommo-types";
import { Emote } from "../../classes/Emote";
import {
  EntitySprite,
  State,
  createEntity,
  createSprite,
  exitLevel,
  getCurrentTime,
  goToLevel,
  listenToSocketioEvent,
  lockCameraToEntity,
  playAudioSource,
  removeEntity,
} from "pixel-pigeon";
import { MainMenuCharacter } from "../../classes/MainMenuCharacter";
import { NPC } from "../../classes/NPC";
import { Party } from "../../classes/Party";
import { Quest } from "../../classes/Quest";
import { QuestGiverQuest } from "../../classes/QuestGiver";
import {
  WorldCharacter,
  WorldCharacterQuestInstance,
} from "../../classes/WorldCharacter";
import { WorldStateSchema, state } from "../../state";
import { addWorldCharacterMarker } from "../addWorldCharacterMarker";
import { canWorldCharacterTurnInQuest } from "../canWorldCharacterTurnInQuest";
import { clearWorldCharacterMarker } from "../clearWorldCharacterMarker";
import { closeWorldMenus } from "../world-menus/closeWorldMenus";
import { createBattleState } from "../state/createBattleState";
import { createMainMenuState } from "../state/main-menu/createMainMenuState";
import { definableExists, getDefinable, getDefinables } from "definables";
import { getConstants } from "../getConstants";
import { getWorldState } from "../state/getWorldState";
import { loadWorldCharacterUpdate } from "../load-updates/loadWorldCharacterUpdate";
import { loadWorldNPCUpdate } from "../load-updates/loadWorldNPCUpdate";
import { loadWorldPartyCharacterUpdate } from "../load-updates/loadWorldPartyCharacterUpdate";
import { loadWorldPartyUpdate } from "../load-updates/loadWorldPartyUpdate";
import { npcDialogueWorldMenu } from "../../world-menus/npcDialogueWorldMenu";
import { resetParty } from "../resetParty";
import { sfxVolumeChannelID } from "../../volumeChannels";
import { updateWorldCharacterOrder } from "../updateWorldCharacterOrder";

export const listenForWorldUpdates = (): void => {
  listenToSocketioEvent<WorldAcceptQuestUpdate>({
    event: "world/accept-quest",
    onMessage: (update: WorldAcceptQuestUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        worldState.values.worldCharacterID,
      );
      const quest: Quest = getDefinable(Quest, update.questID);
      for (const partyWorldCharacter of worldCharacter.party.worldCharacters) {
        const questInstance: WorldCharacterQuestInstance | undefined =
          partyWorldCharacter.questInstances[update.questID];
        if (typeof questInstance === "undefined") {
          partyWorldCharacter.questInstances[update.questID] = {
            isCompleted: false,
            isStarted: false,
            monsterKills: quest.hasMonster() ? 0 : undefined,
          };
        }
        const updatedQuestInstance: WorldCharacterQuestInstance | undefined =
          partyWorldCharacter.questInstances[update.questID];
        if (typeof updatedQuestInstance === "undefined") {
          throw new Error("No updated quest instance.");
        }
        if (updatedQuestInstance.isStarted === false) {
          updatedQuestInstance.isStarted = true;
        }
      }
    },
  });
  listenToSocketioEvent<WorldBonkUpdate>({
    event: "world/bonk",
    onMessage: (): void => {
      playAudioSource("sfx/bonk", {
        volumeChannelID: sfxVolumeChannelID,
      });
    },
  });
  listenToSocketioEvent<WorldMarkerUpdate>({
    event: "world/clear-marker",
    onMessage: (update: WorldClearMarkerUpdate): void => {
      console.log("clear");
      clearWorldCharacterMarker(update.worldCharacterID);
    },
  });
  listenToSocketioEvent<WorldCloseBankUpdate>({
    event: "world/close-bank",
    onMessage: (update: WorldCloseBankUpdate): void => {
      const bank: Bank = getDefinable(Bank, update.bankID);
      bank.isOpen = false;
      bank.toggledAt = getCurrentTime();
    },
  });
  listenToSocketioEvent<WorldEmoteUpdate>({
    event: "world/emote",
    onMessage: (update: WorldEmoteUpdate): void => {
      const constants: Constants = getConstants();
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        update.worldCharacterID,
      );
      if (worldCharacter.hasEmote()) {
        removeEntity(worldCharacter.emote.entityID);
      }
      const emote: Emote = getDefinable(Emote, update.emoteID);
      const sprites: EntitySprite[] = [
        {
          spriteID: createSprite({
            animationID: "default",
            animations: [
              {
                frames: [
                  {
                    height: constants["tile-size"],
                    sourceHeight: constants["tile-size"],
                    sourceWidth: constants["tile-size"],
                    sourceX: 0,
                    sourceY: 0,
                    width: constants["tile-size"],
                  },
                ],
                id: "default",
              },
            ],
            imagePath: emote.backgroundImagePath,
          }),
        },
      ];
      if (emote.hasForegroundImagePath()) {
        sprites.push({
          spriteID: createSprite({
            animationID: "default",
            animations: [
              {
                frames: [
                  {
                    height: constants["tile-size"],
                    sourceHeight: constants["tile-size"],
                    sourceWidth: constants["tile-size"],
                    sourceX: 0,
                    sourceY: 0,
                    width: constants["tile-size"],
                  },
                ],
                id: "default",
              },
            ],
            imagePath: emote.foregroundImagePath,
          }),
        });
      }
      const entityID: string = createEntity({
        height: constants["tile-size"],
        layerID: "emotes",
        levelID: worldCharacter.tilemapID,
        position: {
          x: worldCharacter.position.x * constants["tile-size"],
          y:
            worldCharacter.position.y * constants["tile-size"] -
            constants["tile-size"],
        },
        sprites,
        width: constants["tile-size"],
      });
      worldCharacter.emote = {
        entityID,
        usedAt: getCurrentTime(),
      };
    },
  });
  listenToSocketioEvent<WorldEnterCharactersUpdate>({
    event: "world/enter-characters",
    onMessage: (update: WorldEnterCharactersUpdate): void => {
      for (const worldCharacterUpdate of update.worldCharacters) {
        loadWorldCharacterUpdate(worldCharacterUpdate);
      }
      for (const worldPartyUpdate of update.parties) {
        loadWorldPartyUpdate(worldPartyUpdate);
      }
    },
  });
  listenToSocketioEvent<WorldExitCharactersUpdate>({
    event: "world/exit-characters",
    onMessage: (update: WorldExitCharactersUpdate): void => {
      const affectedPartyIDs: string[] = [];
      for (const worldCharacterID of update.worldCharacterIDs) {
        const worldCharacter: WorldCharacter = getDefinable(
          WorldCharacter,
          worldCharacterID,
        );
        const party: Party = getDefinable(Party, worldCharacter.party.id);
        party.worldCharacters = party.worldCharacters.filter(
          (partyWorldCharacter: WorldCharacter): boolean =>
            partyWorldCharacter.id !== worldCharacter.id,
        );
        if (affectedPartyIDs.includes(party.id) === false) {
          affectedPartyIDs.push(party.id);
        }
        worldCharacter.remove();
      }
      for (const affectedPartyID of affectedPartyIDs) {
        const affectedParty: Party = getDefinable(Party, affectedPartyID);
        if (affectedParty.worldCharacters.length === 0) {
          affectedParty.remove();
        } else {
          resetParty(affectedPartyID);
        }
      }
    },
  });
  listenToSocketioEvent<WorldExitToMainMenuUpdate>({
    event: "world/exit-to-main-menu",
    onMessage: (update: WorldExitToMainMenuUpdate): void => {
      getDefinables(WorldCharacter).forEach(
        (worldCharacter: WorldCharacter): void => {
          worldCharacter.remove();
        },
      );
      getDefinables(Party).forEach((party: Party): void => {
        party.remove();
      });
      const mainMenuCharacterIDs: string[] = [];
      for (const mainMenuCharacterUpdate of update.mainMenuCharacters) {
        mainMenuCharacterIDs.push(
          new MainMenuCharacter({
            classID: mainMenuCharacterUpdate.classID,
            clothesDyeItemID: mainMenuCharacterUpdate.clothesDyeItemID,
            figureID: mainMenuCharacterUpdate.figureID,
            hairDyeItemID: mainMenuCharacterUpdate.hairDyeItemID,
            id: mainMenuCharacterUpdate.id,
            level: mainMenuCharacterUpdate.level,
            maskItemID: mainMenuCharacterUpdate.maskItemID,
            outfitItemID: mainMenuCharacterUpdate.outfitItemID,
            skinColorID: mainMenuCharacterUpdate.skinColorID,
          }).id,
        );
      }
      state.setValues({
        mainMenuState: createMainMenuState(mainMenuCharacterIDs),
        worldState: null,
      });
      exitLevel();
      closeWorldMenus();
    },
  });
  listenToSocketioEvent<WorldMoveCharactersUpdate>({
    event: "world/inn",
    onMessage: (): void => {
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        getWorldState().values.worldCharacterID,
      );
      worldCharacter.party.worldCharacters.forEach(
        (partyWorldCharacter: WorldCharacter): void => {
          partyWorldCharacter.resources = {
            hp: partyWorldCharacter.resources.maxHP,
            maxHP: partyWorldCharacter.resources.maxHP,
            maxMP: partyWorldCharacter.resources.maxMP ?? null,
            mp: partyWorldCharacter.resources.maxMP ?? null,
          };
        },
      );
    },
  });
  listenToSocketioEvent<WorldMoveCharactersUpdate>({
    event: "world/move-characters",
    onMessage: (update: WorldMoveCharactersUpdate): void => {
      for (const worldMoveCharacterUpdate of update.worldCharacters) {
        const worldCharacter: WorldCharacter = getDefinable(
          WorldCharacter,
          worldMoveCharacterUpdate.worldCharacterID,
        );
        worldCharacter.resources =
          typeof worldMoveCharacterUpdate.resources !== "undefined"
            ? {
                hp: worldMoveCharacterUpdate.resources.hp,
                maxHP: worldMoveCharacterUpdate.resources.maxHP,
                maxMP: worldMoveCharacterUpdate.resources.maxMP ?? null,
                mp: worldMoveCharacterUpdate.resources.mp ?? null,
              }
            : null;
        worldCharacter.direction = worldMoveCharacterUpdate.direction;
        worldCharacter.step = worldMoveCharacterUpdate.step;
        updateWorldCharacterOrder(
          worldCharacter.id,
          worldMoveCharacterUpdate.order,
        );
        switch (worldCharacter.direction) {
          case Direction.Down:
            worldCharacter.position = {
              x: worldCharacter.position.x,
              y: worldCharacter.position.y + 1,
            };
            break;
          case Direction.Left:
            worldCharacter.position = {
              x: worldCharacter.position.x - 1,
              y: worldCharacter.position.y,
            };
            break;
          case Direction.Right:
            worldCharacter.position = {
              x: worldCharacter.position.x + 1,
              y: worldCharacter.position.y,
            };
            break;
          case Direction.Up:
            worldCharacter.position = {
              x: worldCharacter.position.x,
              y: worldCharacter.position.y - 1,
            };
            break;
        }
        worldCharacter.movedAt = getCurrentTime();
      }
      for (const clearedMarkerWorldCharacterID of update.clearedMarkerWorldCharacterIDs) {
        const clearedMarkerWorldCharacter: WorldCharacter = getDefinable(
          WorldCharacter,
          clearedMarkerWorldCharacterID,
        );
        if (clearedMarkerWorldCharacter.hasMarker()) {
          clearWorldCharacterMarker(clearedMarkerWorldCharacterID);
        }
      }
    },
  });
  listenToSocketioEvent<WorldOpenBankUpdate>({
    event: "world/open-bank",
    onMessage: (update: WorldOpenBankUpdate): void => {
      const bank: Bank = getDefinable(Bank, update.bankID);
      bank.isOpen = true;
      bank.toggledAt = getCurrentTime();
    },
  });
  listenToSocketioEvent<WorldOpenChestUpdate>({
    event: "world/open-chest",
    onMessage: (update: WorldOpenChestUpdate): void => {
      getDefinable(
        WorldCharacter,
        getWorldState().values.worldCharacterID,
      ).party.worldCharacters.forEach(
        (worldCharacter: WorldCharacter): void => {
          if (
            worldCharacter.openedChestIDs.includes(update.chestID) === false
          ) {
            worldCharacter.openedChestIDs = [
              ...worldCharacter.openedChestIDs,
              update.chestID,
            ];
          }
        },
      );
      getDefinable(Chest, update.chestID).openedAt = getCurrentTime();
    },
  });
  listenToSocketioEvent<WorldPartyChangesUpdate>({
    event: "world/party-change",
    onMessage: (update: WorldPartyChangesUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      for (const worldPartyUpdate of update.parties) {
        const party: Party = definableExists(Party, worldPartyUpdate.partyID)
          ? getDefinable(Party, worldPartyUpdate.partyID)
          : new Party({ id: worldPartyUpdate.partyID });
        const oldPartyWorldCharacterIDs: readonly string[] =
          party.worldCharacterIDs;
        party.worldCharacters = worldPartyUpdate.worldCharacterIDs.map(
          (worldCharacterID: string): WorldCharacter =>
            getDefinable(WorldCharacter, worldCharacterID),
        );
        party.worldCharacters.forEach(
          (
            partyWorldCharacter: WorldCharacter,
            partyWorldCharacterIndex: number,
          ): void => {
            partyWorldCharacter.partyID = party.id;
            const partyWorldCharacterJoined: boolean =
              oldPartyWorldCharacterIDs.includes(partyWorldCharacter.id) ===
              false;
            const partyWorldCharacterIsSelf: boolean =
              partyWorldCharacter.id === worldState.values.worldCharacterID;
            // If self is joining a party
            if (
              partyWorldCharacterIndex > 0 &&
              partyWorldCharacterJoined &&
              partyWorldCharacterIsSelf
            ) {
              worldState.setValues({
                pianoSessionID: null,
              });
              getDefinables(WorldCharacter).forEach(
                (worldCharacter: WorldCharacter): void => {
                  if (worldCharacter.hasMarker()) {
                    clearWorldCharacterMarker(worldCharacter.id);
                  }
                },
              );
            } else if (
              party.worldCharacterIDs.length > oldPartyWorldCharacterIDs.length
            ) {
              if (partyWorldCharacter.hasMarker()) {
                clearWorldCharacterMarker(partyWorldCharacter.id);
              }
            }
          },
        );
        resetParty(party.id);
      }
      for (const partyIDToRemove of update.partyIDsToRemove) {
        getDefinable(Party, partyIDToRemove).remove();
      }
      for (const worldPartyCharacterUpdate of update.worldCharacters) {
        loadWorldPartyCharacterUpdate(worldPartyCharacterUpdate);
      }
    },
  });
  listenToSocketioEvent<WorldMarkerUpdate>({
    event: "world/marker",
    onMessage: (update: WorldMarkerUpdate): void => {
      addWorldCharacterMarker(update.worldCharacterID, update.type);
    },
  });
  listenToSocketioEvent<WorldPianoKeyUpdate>({
    event: "world/piano-key",
    onMessage: (update: WorldPianoKeyUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const offset: number = update.sinceLastKey ?? 0;
      let noteTime: number | undefined;
      if (update.pianoSessionID !== worldState.values.pianoSessionID) {
        noteTime = getCurrentTime() + 1000;
      } else {
        if (worldState.values.lastPianoNoteAt === null) {
          throw new Error("lastPianoNoteAt is null");
        }
        noteTime = worldState.values.lastPianoNoteAt + offset;
      }
      worldState.setValues({
        lastPianoNoteAt: noteTime,
        pianoNotes: [
          ...worldState.values.pianoNotes,
          {
            index: update.index,
            playAt: noteTime,
            type: update.type,
          },
        ],
        pianoSessionID: update.pianoSessionID,
      });
    },
  });
  listenToSocketioEvent<WorldPositionUpdate>({
    event: "world/position",
    onMessage: (update: WorldPositionUpdate): void => {
      getDefinables(WorldCharacter).forEach(
        (worldCharacter: WorldCharacter): void => {
          worldCharacter.remove();
        },
      );
      getDefinables(Party).forEach((party: Party): void => {
        party.remove();
      });
      goToLevel(update.tilemapID);
      for (const worldCharacterUpdate of update.worldCharacters) {
        loadWorldCharacterUpdate(worldCharacterUpdate);
      }
      for (const worldPartyUpdate of update.parties) {
        loadWorldPartyUpdate(worldPartyUpdate);
      }
      for (const worldNPCUpdate of update.npcs) {
        loadWorldNPCUpdate(worldNPCUpdate);
      }
      lockCameraToEntity(
        getDefinable(WorldCharacter, getWorldState().values.worldCharacterID)
          .entityID,
      );
    },
  });
  listenToSocketioEvent<WorldPreparationUpdate>({
    event: "world/preparation",
    onMessage: (update: WorldPreparationUpdate): void => {
      for (const worldPreparationCharacter of update.worldPreparationCharacters) {
        const worldCharacter: WorldCharacter = getDefinable(
          WorldCharacter,
          worldPreparationCharacter.worldCharacterID,
        );
        worldCharacter.resources = {
          hp: worldPreparationCharacter.resources.hp,
          maxHP: worldPreparationCharacter.resources.maxHP,
          maxMP: worldPreparationCharacter.resources.maxMP ?? null,
          mp: worldPreparationCharacter.resources.mp ?? null,
        };
      }
    },
  });
  listenToSocketioEvent<WorldSelectQuestUpdate>({
    event: "world/select-quest",
    onMessage: (update: WorldSelectQuestUpdate): void => {
      if (npcDialogueWorldMenu.isOpen() === false) {
        closeWorldMenus();
        npcDialogueWorldMenu.open({
          isLeader: false,
          npcID: update.npcID,
        });
      }
      const npc: NPC = getDefinable(NPC, update.npcID);
      npcDialogueWorldMenu.state.setValues({
        selectedQuestIndex:
          typeof update.questID !== "undefined"
            ? npc.questGiver.quests.findIndex(
                (questGiverQuest: QuestGiverQuest): boolean =>
                  questGiverQuest.questID === update.questID,
              )
            : null,
      });
    },
  });
  listenToSocketioEvent<WorldStartBattleUpdate>({
    event: "world/start-battle",
    onMessage: (): void => {
      getDefinables(WorldCharacter).forEach(
        (worldCharacter: WorldCharacter): void => {
          worldCharacter.remove();
        },
      );
      getDefinables(Party).forEach((party: Party): void => {
        party.remove();
      });
      state.setValues({
        battleState: createBattleState(),
        worldState: null,
      });
      exitLevel();
      closeWorldMenus();
    },
  });
  listenToSocketioEvent<WorldBonkUpdate>({
    event: "world/teleport",
    onMessage: (): void => {
      playAudioSource("sfx/teleport", {
        volumeChannelID: sfxVolumeChannelID,
      });
    },
  });
  listenToSocketioEvent<WorldTradeUpdate>({
    event: "world/trade",
    onMessage: (): void => {
      for (const worldCharacter of getDefinables(WorldCharacter).values()) {
        if (worldCharacter.hasMarker()) {
          clearWorldCharacterMarker(worldCharacter.id);
        }
      }
    },
  });
  listenToSocketioEvent<WorldTurnCharactersUpdate>({
    event: "world/turn-characters",
    onMessage: (update: WorldTurnCharactersUpdate): void => {
      for (const turn of update.turns) {
        const worldCharacter: WorldCharacter = getDefinable(
          WorldCharacter,
          turn.worldCharacterID,
        );
        worldCharacter.direction = turn.direction;
      }
    },
  });
  listenToSocketioEvent<WorldTurnInQuestUpdate>({
    event: "world/turn-in-quest",
    onMessage: (update: WorldTurnInQuestUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        worldState.values.worldCharacterID,
      );
      const quest: Quest = getDefinable(Quest, update.questID);
      for (const partyWorldCharacter of worldCharacter.party.worldCharacters) {
        const questInstance: WorldCharacterQuestInstance | undefined =
          partyWorldCharacter.questInstances[update.questID];
        if (canWorldCharacterTurnInQuest(partyWorldCharacter.id, quest.id)) {
          if (typeof questInstance !== "undefined") {
            if (questInstance.isCompleted === false) {
              questInstance.isCompleted = true;
            }
          }
        }
      }
      for (const worldCharacterUpdate of update.worldCharacters) {
        const partyWorldCharacter: WorldCharacter = getDefinable(
          WorldCharacter,
          worldCharacterUpdate.worldCharacterID,
        );
        partyWorldCharacter.resources = {
          hp: worldCharacterUpdate.resources.hp,
          maxHP: worldCharacterUpdate.resources.maxHP,
          maxMP: worldCharacterUpdate.resources.maxMP ?? null,
          mp: worldCharacterUpdate.resources.mp ?? null,
        };
      }
    },
  });
  listenToSocketioEvent<WorldTurnNPCUpdate>({
    event: "world/turn-npc",
    onMessage: (update: WorldTurnNPCUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        worldState.values.worldCharacterID,
      );
      const isLeader: boolean =
        worldCharacter.party.worldCharacterIDs[0] === worldCharacter.id;
      const npc: NPC = getDefinable(NPC, update.npcID);
      npc.direction = update.direction;
      if (update.wasInteracted === true) {
        if (npc.hasDialogue() || npc.hasQuestGiver()) {
          closeWorldMenus();
          npcDialogueWorldMenu.open({
            isLeader,
            npcID: npc.id,
          });
        }
      }
    },
  });
  listenToSocketioEvent<WorldVanityUpdate>({
    event: "world/vanity",
    onMessage: (update: WorldVanityUpdate): void => {
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        update.worldCharacterID,
      );
      switch (update.slot) {
        case VanitySlot.ClothesDye:
          worldCharacter.clothesDyeItemID = update.vanityItemID ?? null;
          break;
        case VanitySlot.HairDye:
          worldCharacter.hairDyeItemID = update.vanityItemID ?? null;
          break;
        case VanitySlot.Mask:
          worldCharacter.maskItemID = update.vanityItemID ?? null;
          break;
        case VanitySlot.Outfit:
          worldCharacter.outfitItemID = update.vanityItemID ?? null;
          break;
      }
    },
  });
};
