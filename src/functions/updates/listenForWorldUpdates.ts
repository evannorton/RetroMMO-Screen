import { Character } from "../../classes/Character";
import {
  WorldBonkUpdate,
  WorldEnterCharacterUpdate,
  WorldExitCharacterUpdate,
  WorldExitToMainMenuUpdate,
  WorldJoinPartyUpdate,
  WorldMoveCharacterUpdate,
  WorldPositionUpdate,
  WorldStartBattleUpdate,
} from "retrommo-types";
import { createBattleState } from "../state/createBattleState";
import { createMainMenuState } from "../state/main-menu/createMainMenuState";
import {
  exitLevel,
  goToLevel,
  listenToSocketioEvent,
  playAudioSource,
  setEntityLevel,
} from "pixel-pigeon";
import { getDefinable, getDefinables } from "../../definables";
import { loadWorldCharacterUpdate } from "../loadWorldCharacterUpdate";
import { moveCharacter } from "../moveCharacter";
import { resetPartyPosition } from "../resetPartyPosition";
import { sfxVolumeChannelID } from "../../volumeChannels";
import { state } from "../../state";
import { updateCharacterParty } from "../updateCharacterParty";
import { updateCharacterPosition } from "../updateCharacterPosition";

export const listenForWorldUpdates = (): void => {
  listenToSocketioEvent<WorldBonkUpdate>({
    event: "world/bonk",
    onMessage: (): void => {
      playAudioSource("sfx/bonk", {
        volumeChannelID: sfxVolumeChannelID,
      });
    },
  });
  listenToSocketioEvent<WorldEnterCharacterUpdate>({
    event: "world/enter-character",
    onMessage: (update: WorldEnterCharacterUpdate): void => {
      loadWorldCharacterUpdate(update.character);
    },
  });
  listenToSocketioEvent<WorldExitCharacterUpdate>({
    event: "world/exit-character",
    onMessage: (update: WorldExitCharacterUpdate): void => {
      getDefinable(Character, update.characterID).remove();
    },
  });
  listenToSocketioEvent<WorldExitToMainMenuUpdate>({
    event: "world/exit-to-main-menu",
    onMessage: (): void => {
      if (state.values.worldState === null) {
        throw new Error("No world state.");
      }
      const character: Character = getDefinable(
        Character,
        state.values.worldState.values.characterID,
      );
      character.removeFromWorld();
      getDefinables(Character).forEach((loopedCharacter: Character): void => {
        if (loopedCharacter.belongsToPlayer() === false) {
          loopedCharacter.remove();
        }
      });
      state.setValues({
        mainMenuState: createMainMenuState(),
        worldState: null,
      });
      exitLevel();
    },
  });
  listenToSocketioEvent<WorldJoinPartyUpdate>({
    event: "world/join-party",
    onMessage: (update: WorldJoinPartyUpdate): void => {
      updateCharacterParty(update.characterID, update.partyID);
      resetPartyPosition(update.partyID);
    },
  });
  listenToSocketioEvent<WorldMoveCharacterUpdate>({
    event: "world/move-character",
    onMessage: (update: WorldMoveCharacterUpdate): void => {
      const character: Character = getDefinable(Character, update.characterID);
      character.direction = update.direction;
      moveCharacter(update.characterID);
    },
  });
  listenToSocketioEvent<WorldPositionUpdate>({
    event: "world/position",
    onMessage: (update: WorldPositionUpdate): void => {
      if (state.values.worldState === null) {
        throw new Error("No world state.");
      }
      const character: Character = getDefinable(
        Character,
        state.values.worldState.values.characterID,
      );
      character.tilemapID = update.tilemapID;
      goToLevel(update.tilemapID);
      setEntityLevel(character.entityID, update.tilemapID);
      updateCharacterPosition(character.id, update.x, update.y);
      getDefinables(Character).forEach((loopedCharacter: Character): void => {
        if (loopedCharacter.belongsToPlayer() === false) {
          loopedCharacter.remove();
        }
      });
      for (const updateCharacter of update.characters) {
        loadWorldCharacterUpdate(updateCharacter);
      }
    },
  });
  listenToSocketioEvent<WorldStartBattleUpdate>({
    event: "world/start-battle",
    onMessage: (): void => {
      if (state.values.worldState === null) {
        throw new Error("No world state.");
      }
      const character: Character = getDefinable(
        Character,
        state.values.worldState.values.characterID,
      );
      character.removeFromWorld();
      getDefinables(Character).forEach((loopedCharacter: Character): void => {
        if (loopedCharacter.belongsToPlayer() === false) {
          loopedCharacter.remove();
        }
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
