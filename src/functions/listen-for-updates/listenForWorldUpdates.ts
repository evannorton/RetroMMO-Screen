import { Chest } from "../../classes/Chest";
import {
  Constants,
  Direction,
  Step,
  WorldBonkUpdate,
  WorldEmoteUpdate,
  WorldEnterCharactersUpdate,
  WorldExitCharactersUpdate,
  WorldExitToMainMenuUpdate,
  WorldMoveCharactersUpdate,
  WorldOpenChestUpdate,
  WorldPartyChangesUpdate,
  WorldPositionUpdate,
  WorldPreparationUpdate,
  WorldStartBattleUpdate,
  WorldTurnCharactersUpdate,
  WorldTurnNPCUpdate,
} from "retrommo-types";
import { Emote } from "../../classes/Emote";
import {
  EntitySprite,
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
import { WorldCharacter } from "../../classes/WorldCharacter";
import { createBattleState } from "../state/createBattleState";
import { createMainMenuState } from "../state/main-menu/createMainMenuState";
import { definableExists, getDefinable, getDefinables } from "definables";
import { getConstants } from "../getConstants";
import { getWorldState } from "../state/getWorldState";
import { loadWorldCharacterUpdate } from "../load-updates/loadWorldCharacterUpdate";
import { loadWorldPartyCharacterUpdate } from "../load-updates/loadWorldPartyCharacterUpdate";
import { loadWorldPartyUpdate } from "../load-updates/loadWorldPartyUpdate";
import { sfxVolumeChannelID } from "../../volumeChannels";
import { state } from "../../state";
import { updateWorldCharacterOrder } from "../updateWorldCharacterOrder";
import { updateWorldCharacterPosition } from "../updateWorldCharacterPosition";

export const listenForWorldUpdates = (): void => {
  listenToSocketioEvent<WorldBonkUpdate>({
    event: "world/bonk",
    onMessage: (): void => {
      playAudioSource("sfx/bonk", {
        volumeChannelID: sfxVolumeChannelID,
      });
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
        if (party.worldCharacters.length === 0) {
          party.remove();
        }
        worldCharacter.remove();
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
          partyWorldCharacter.resources.hp =
            partyWorldCharacter.resources.maxHP;
          partyWorldCharacter.resources.mp =
            partyWorldCharacter.resources.maxMP;
        },
      );
    },
  });
  listenToSocketioEvent<WorldMoveCharactersUpdate>({
    event: "world/move-characters",
    onMessage: (update: WorldMoveCharactersUpdate): void => {
      for (const move of update.moves) {
        const worldCharacter: WorldCharacter = getDefinable(
          WorldCharacter,
          move.worldCharacterID,
        );
        worldCharacter.direction = move.direction;
        worldCharacter.step = move.step;
        updateWorldCharacterOrder(worldCharacter.id, move.order);
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
      for (const worldPartyUpdate of update.parties) {
        const party: Party = definableExists(Party, worldPartyUpdate.partyID)
          ? getDefinable(Party, worldPartyUpdate.partyID)
          : new Party({ id: worldPartyUpdate.partyID });
        party.worldCharacters = worldPartyUpdate.worldCharacterIDs.map(
          (worldCharacterID: string): WorldCharacter =>
            getDefinable(WorldCharacter, worldCharacterID),
        );
        for (const worldCharacter of party.worldCharacters) {
          worldCharacter.party = party;
        }
        const partyLeaderCharacter: WorldCharacter | undefined =
          party.worldCharacters[0];
        if (!partyLeaderCharacter) {
          throw new Error("No party leader character.");
        }
        for (const partyCharacter of party.worldCharacters) {
          if (partyCharacter !== partyLeaderCharacter) {
            updateWorldCharacterPosition(
              partyCharacter.id,
              partyLeaderCharacter.position,
            );
            partyCharacter.direction = Direction.Down;
            partyCharacter.step = Step.Right;
          }
        }
      }
      for (const partyIDToRemove of update.partyIDsToRemove) {
        getDefinable(Party, partyIDToRemove).remove();
      }
      for (const worldPartyCharacterUpdate of update.characters) {
        loadWorldPartyCharacterUpdate(worldPartyCharacterUpdate);
      }
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
        worldCharacter.resources.hp = worldPreparationCharacter.resources.hp;
        worldCharacter.resources.mp =
          worldPreparationCharacter.resources.mp ?? null;
        worldCharacter.resources.maxHP =
          worldPreparationCharacter.resources.maxHP;
        worldCharacter.resources.maxMP =
          worldPreparationCharacter.resources.maxMP ?? null;
      }
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
  listenToSocketioEvent<WorldTurnNPCUpdate>({
    event: "world/turn-npc",
    onMessage: (update: WorldTurnNPCUpdate): void => {
      const npc: NPC = getDefinable(NPC, update.npcID);
      npc.direction = update.direction;
    },
  });
};