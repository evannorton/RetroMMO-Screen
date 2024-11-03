import {
  Direction,
  Step,
  WorldBonkUpdate,
  WorldEnterCharactersUpdate,
  WorldExitCharactersUpdate,
  WorldExitToMainMenuUpdate,
  WorldMoveCharactersUpdate,
  WorldPartyChangesUpdate,
  WorldPositionUpdate,
  WorldStartBattleUpdate,
  WorldTurnCharactersUpdate,
  WorldTurnNPCUpdate,
} from "retrommo-types";
import { MainMenuCharacter } from "../../classes/MainMenuCharacter";
import { NPC } from "../../classes/NPC";
import { Party } from "../../classes/Party";
import { WorldCharacter } from "../../classes/WorldCharacter";
import { createBattleState } from "../state/createBattleState";
import { createMainMenuState } from "../state/main-menu/createMainMenuState";
import { definableExists, getDefinable, getDefinables } from "definables";
import {
  exitLevel,
  getCurrentTime,
  goToLevel,
  listenToSocketioEvent,
  lockCameraToEntity,
  playAudioSource,
  setEntityZIndex,
} from "pixel-pigeon";
import { getWorldState } from "../state/getWorldState";
import { loadWorldCharacterUpdate } from "../loadWorldCharacterUpdate";
import { loadWorldPartyUpdate } from "../loadWorldPartyUpdate";
import { sfxVolumeChannelID } from "../../volumeChannels";
import { state } from "../../state";
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
    event: "world/move-characters",
    onMessage: (update: WorldMoveCharactersUpdate): void => {
      for (const move of update.moves) {
        const worldCharacter: WorldCharacter = getDefinable(
          WorldCharacter,
          move.worldCharacterID,
        );
        worldCharacter.direction = move.direction;
        worldCharacter.step = move.step;
        worldCharacter.order = move.order;
        setEntityZIndex(worldCharacter.entityID, worldCharacter.order);
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
