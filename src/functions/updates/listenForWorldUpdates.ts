import { Character } from "../../classes/Character";
import {
  Constants,
  WorldBonkUpdate,
  WorldEnterCharacterUpdate,
  WorldExitCharacterUpdate,
  WorldExitToMainMenuUpdate,
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
  setEntityPosition,
} from "pixel-pigeon";
import { getConstants } from "../getConstants";
import { getDefinable, getDefinables } from "../../definables";
import { loadWorldCharacterUpdate } from "../loadWorldCharacterUpdate";
import { sfxVolumeChannelID } from "../../volumeChannels";
import { state } from "../../state";

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
  listenToSocketioEvent<WorldMoveCharacterUpdate>({
    event: "world/move-character",
    onMessage: (update: WorldMoveCharacterUpdate): void => {
      const character: Character = getDefinable(Character, update.characterID);
      character.move(update.direction);
    },
  });
  listenToSocketioEvent<WorldPositionUpdate>({
    event: "world/position",
    onMessage: (update: WorldPositionUpdate): void => {
      if (state.values.worldState === null) {
        throw new Error("No world state.");
      }
      const constants: Constants = getConstants();
      const character: Character = getDefinable(
        Character,
        state.values.worldState.values.characterID,
      );
      character.x = update.x;
      character.y = update.y;
      character.tilemapID = update.tilemapID;
      goToLevel(update.tilemapID);
      setEntityLevel(character.entityID, update.tilemapID);
      setEntityPosition(character.entityID, {
        x: update.x * constants["tile-size"],
        y: update.y * constants["tile-size"],
      });
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
