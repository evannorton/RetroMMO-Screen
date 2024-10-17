import {
  Direction,
  WorldBonkUpdate,
  WorldEnterCharactersUpdate,
  WorldExitCharactersUpdate,
  WorldExitToMainMenuUpdate,
  WorldMoveCharacterUpdate,
  WorldPartyChangesUpdate,
  WorldPositionUpdate,
  WorldStartBattleUpdate,
} from "retrommo-types";
import { MainMenuCharacter } from "../../classes/MainMenuCharacter";
import { Party } from "../../classes/Party";
import { WorldCharacter } from "../../classes/WorldCharacter";
import { createBattleState } from "../state/createBattleState";
import { createMainMenuState } from "../state/main-menu/createMainMenuState";
import { definableExists, getDefinable, getDefinables } from "definables";
import {
  exitLevel,
  goToLevel,
  listenToSocketioEvent,
  lockCameraToEntity,
  playAudioSource,
  setEntityZIndex,
} from "pixel-pigeon";
import { getWorldState } from "../state/getWorldState";
import { loadWorldCharacterUpdate } from "../loadWorldCharacterUpdate";
import { loadWorldPartyUpdate } from "../loadWorldPartyUpdate";
import { moveWorldCharacter } from "../moveWorldCharacter";
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
  listenToSocketioEvent<WorldMoveCharacterUpdate>({
    event: "world/move-character",
    onMessage: (update: WorldMoveCharacterUpdate): void => {
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        update.worldCharacterID,
      );
      worldCharacter.direction = update.direction;
      worldCharacter.order = update.order;
      setEntityZIndex(worldCharacter.entityID, worldCharacter.order);
      moveWorldCharacter(update.worldCharacterID);
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
              partyLeaderCharacter.x,
              partyLeaderCharacter.y,
            );
            partyCharacter.direction = Direction.Down;
          }
        }
      }
      for (const partyIDtoRemove of update.partyIDsToRemove) {
        getDefinable(Party, partyIDtoRemove).remove();
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
};
