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
  playAudioSource,
  setEntityLevel,
  setEntityPosition,
} from "pixel-pigeon";
import { getConstants } from "../getConstants";
import { getDefinable, getDefinables } from "../../definables";
import { listenForUpdate } from "./listenForUpdate";
import { loadWorldCharacterUpdate } from "../loadWorldCharacterUpdate";
import { sfxVolumeChannelID } from "../../volumeChannels";
import { state } from "../../state";

export const listenForWorldUpdates = (): void => {
  listenForUpdate<WorldBonkUpdate>("world/bonk", (): void => {
    console.log("bonk");
    playAudioSource("sfx/bonk", {
      volumeChannelID: sfxVolumeChannelID,
    });
  });
  listenForUpdate<WorldEnterCharacterUpdate>(
    "world/enter-character",
    (update: WorldEnterCharacterUpdate): void => {
      loadWorldCharacterUpdate(update.character);
    },
  );
  listenForUpdate<WorldExitCharacterUpdate>(
    "world/exit-character",
    (update: WorldExitCharacterUpdate): void => {
      getDefinable(Character, update.characterID).remove();
    },
  );
  listenForUpdate<WorldExitToMainMenuUpdate>(
    "world/exit-to-main-menu",
    (): void => {
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
  );
  listenForUpdate<WorldMoveCharacterUpdate>(
    "world/move-character",
    (update: WorldMoveCharacterUpdate): void => {
      const character: Character = getDefinable(Character, update.characterID);
      character.move(update.direction);
    },
  );
  listenForUpdate<WorldPositionUpdate>(
    "world/position",
    (update: WorldPositionUpdate): void => {
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
  );
  listenForUpdate<WorldStartBattleUpdate>("world/start-battle", (): void => {
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
  });
};
