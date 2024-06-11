import {
  BattleExitToWorldUpdate,
  Constants,
  InitialUpdate,
  MainMenuCharacterCustomizeCreateCharacterUpdate,
  MainMenuCharacterSelectDeleteCharacterUpdate,
  MainMenuCharacterSelectSelectCharacterUpdate,
  MainMenuCharacterSelectSortCharacterLeftUpdate,
  MainMenuCharacterSelectSortCharacterRightUpdate,
  MainState,
  WorldEnterCharacterUpdate,
  WorldExitCharacterUpdate,
  WorldExitToMainMenuUpdate,
  WorldMoveCharacterUpdate,
  WorldPositionUpdate,
  WorldStartBattleUpdate,
} from "retrommo-types";
import { Character } from "../classes/Character";
import { ItemInstance } from "../classes/ItemInstance";
import { createBattleState } from "./state/createBattleState";
import { createCharacterSelectState } from "./state/main-menu/createCharacterSelectState";
import { createMainMenuState } from "./state/main-menu/createMainMenuState";
import { createWorldState } from "./state/createWorldState";
import {
  exitLevel,
  goToLevel,
  listenToSocketioEvent,
  setEntityLevel,
  setEntityPosition,
} from "pixel-pigeon";
import { getCharacterSelectState } from "./state/main-menu/getCharacterSelectState";
import { getConstants } from "./getConstants";
import { getDefinable, getDefinables } from "../definables";
import { getLastPlayableCharacterIndex } from "./getLastPlayableCharacterIndex";
import { loadSavefile } from "./loadSavefile";
import { loadWorldCharacterUpdate } from "./loadWorldCharacterUpdate";
import { state } from "../state";

const listenForUpdate = <Update>(
  eventName: string,
  callback: (update: Update) => void,
): void => {
  listenToSocketioEvent({
    event: eventName,
    onMessage: (update: unknown): void => {
      callback(update as Update);
    },
  });
};

export const listenForUpdates = (): void => {
  listenForUpdate<InitialUpdate>(
    "initial-update",
    (update: InitialUpdate): void => {
      for (const itemInstance of getDefinables(ItemInstance).values()) {
        itemInstance.remove();
      }
      for (const character of getDefinables(Character).values()) {
        character.remove();
      }
      state.setValues({
        battleState: null,
        isSubscribed: update.isSubscribed,
        mainMenuState: null,
        userID: update.userID,
        username: update.username,
        worldState: null,
      });
      loadSavefile(update.savefile);
      switch (update.mainState) {
        case MainState.Battle:
          state.setValues({
            battleState: createBattleState(),
          });
          break;
        case MainState.MainMenu:
          state.setValues({
            mainMenuState: createMainMenuState(),
          });
          break;
        case MainState.World: {
          if (typeof update.world === "undefined") {
            throw new Error(
              "Initial update in World MainState is missing world.",
            );
          }
          state.setValues({
            worldState: createWorldState(update.world.characterID),
          });
          const character: Character = getDefinable(
            Character,
            update.world.characterID,
          );
          character.selectCharacter();
          for (const characterUpdate of update.world.characters) {
            loadWorldCharacterUpdate(characterUpdate);
          }
          break;
        }
      }
    },
  );
  listenForUpdate<BattleExitToWorldUpdate>(
    "battle/exit-to-world",
    (update: BattleExitToWorldUpdate): void => {
      state.setValues({
        battleState: null,
        worldState: createWorldState(update.characterID),
      });
      const character: Character = getDefinable(Character, update.characterID);
      character.tilemapID = update.tilemapID;
      character.x = update.x;
      character.y = update.y;
      character.selectCharacter();
      for (const characterUpdate of update.characters) {
        loadWorldCharacterUpdate(characterUpdate);
      }
    },
  );
  listenForUpdate<MainMenuCharacterCustomizeCreateCharacterUpdate>(
    "main-menu/character-customize/create-character",
    (update: MainMenuCharacterCustomizeCreateCharacterUpdate): void => {
      if (state.values.mainMenuState === null) {
        throw new Error("No main menu state.");
      }
      if (state.values.username === null) {
        throw new Error("No username.");
      }
      if (state.values.userID === null) {
        throw new Error("No userID.");
      }
      new ItemInstance({
        id: update.clothesDyeSavefileItemInstance.id,
        itemID: update.clothesDyeSavefileItemInstance.itemID,
      });
      new ItemInstance({
        id: update.hairDyeSavefileItemInstance.id,
        itemID: update.hairDyeSavefileItemInstance.itemID,
      });
      new ItemInstance({
        id: update.maskSavefileItemInstance.id,
        itemID: update.maskSavefileItemInstance.itemID,
      });
      new ItemInstance({
        id: update.outfitSavefileItemInstance.id,
        itemID: update.outfitSavefileItemInstance.itemID,
      });
      const characterID: string = new Character({
        classID: update.classID,
        clothesDyeItemInstanceID: update.clothesDyeSavefileItemInstance.id,
        figureID: update.figureID,
        hairDyeItemInstanceID: update.hairDyeSavefileItemInstance.id,
        id: update.id,
        level: update.level,
        maskItemInstanceID: update.maskSavefileItemInstance.id,
        outfitItemInstanceID: update.outfitSavefileItemInstance.id,
        skinColorID: update.skinColorID,
        tilemapID: update.tilemapID,
        userID: state.values.userID,
        username: state.values.username,
        x: update.x,
        y: update.y,
      }).id;
      state.setValues({
        characterIDs: [...state.values.characterIDs, characterID],
      });
      state.values.mainMenuState.setValues({
        characterCustomizeState: null,
        characterSelectState: createCharacterSelectState(),
      });
    },
  );
  listenForUpdate<MainMenuCharacterSelectDeleteCharacterUpdate>(
    "main-menu/character-select/delete-character",
    (update: MainMenuCharacterSelectDeleteCharacterUpdate): void => {
      const character: Character = getDefinable(Character, update.characterID);
      character.remove();
      state.setValues({
        characterIDs: state.values.characterIDs.filter(
          (loopedCharacterID: string): boolean =>
            loopedCharacterID !== character.id,
        ),
      });
      getCharacterSelectState().setValues({
        characterIDToDelete: null,
        isDeleting: false,
      });
    },
  );
  listenForUpdate<MainMenuCharacterSelectSelectCharacterUpdate>(
    "main-menu/character-select/select-character",
    (update: MainMenuCharacterSelectSelectCharacterUpdate): void => {
      state.setValues({
        mainMenuState: null,
        worldState: createWorldState(update.characterID),
      });
      const character: Character = getDefinable(Character, update.characterID);
      character.selectCharacter();
      for (const characterUpdate of update.characters) {
        loadWorldCharacterUpdate(characterUpdate);
      }
    },
  );
  listenForUpdate<MainMenuCharacterSelectSortCharacterLeftUpdate>(
    "main-menu/character-select/sort-character-left",
    (update: MainMenuCharacterSelectSortCharacterLeftUpdate): void => {
      const characterIndex: number = state.values.characterIDs.indexOf(
        update.characterID,
      );
      const targetIndex: number =
        characterIndex === 0
          ? getLastPlayableCharacterIndex()
          : characterIndex - 1;
      const targetCharacterID: string = state.values.characterIDs[targetIndex];
      const characterIDs: string[] = [...state.values.characterIDs];
      characterIDs[targetIndex] = update.characterID;
      characterIDs[characterIndex] = targetCharacterID;
      state.setValues({ characterIDs });
    },
  );
  listenForUpdate<MainMenuCharacterSelectSortCharacterRightUpdate>(
    "main-menu/character-select/sort-character-right",
    (update: MainMenuCharacterSelectSortCharacterRightUpdate): void => {
      const characterIndex: number = state.values.characterIDs.indexOf(
        update.characterID,
      );
      const targetIndex: number =
        characterIndex === getLastPlayableCharacterIndex()
          ? 0
          : characterIndex + 1;
      const targetCharacterID: string = state.values.characterIDs[targetIndex];
      const characterIDs: string[] = [...state.values.characterIDs];
      characterIDs[targetIndex] = update.characterID;
      characterIDs[characterIndex] = targetCharacterID;
      state.setValues({ characterIDs });
    },
  );
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
