import { Character } from "../classes/Character";
import {
  CharacterUpdate,
  CreateCharacterUpdate,
  DeleteCharacterUpdate,
  ExitCharacterUpdate,
  ExitToMainMenuUpdate,
  InitialUpdate,
  MainState,
  MoveCharacterUpdate,
  SelectCharacterUpdate,
  SortCharacterLeftUpdate,
  SortCharacterRightUpdate,
} from "retrommo-types";
import { ItemInstance } from "../classes/ItemInstance";
import { createBattleState } from "./state/createBattleState";
import { createCharacterSelectState } from "./state/main-menu/createCharacterSelectState";
import { createMainMenuState } from "./state/main-menu/createMainMenuState";
import { createWorldState } from "./state/createWorldState";
import { exitLevel, listenToSocketioEvent } from "pixel-pigeon";
import { getCharacterSelectState } from "./state/main-menu/getCharacterSelectState";
import { getDefinable, getDefinables } from "../definables";
import { getLastPlayableCharacterIndex } from "./getLastPlayableCharacterIndex";
import { loadCharacterUpdate } from "./loadCharacterUpdate";
import { loadSavefile } from "./loadSavefile";
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
            loadCharacterUpdate(characterUpdate);
          }
          break;
        }
      }
    },
  );
  listenForUpdate<CreateCharacterUpdate>(
    "character-customize/create-character",
    (update: CreateCharacterUpdate): void => {
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
  listenForUpdate<DeleteCharacterUpdate>(
    "character-select/delete-character",
    (update: DeleteCharacterUpdate): void => {
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
  listenForUpdate<SelectCharacterUpdate>(
    "character-select/select-character",
    (update: SelectCharacterUpdate): void => {
      state.setValues({
        mainMenuState: null,
        worldState: createWorldState(update.characterID),
      });
      const character: Character = getDefinable(Character, update.characterID);
      character.selectCharacter();
      for (const characterUpdate of update.characters) {
        loadCharacterUpdate(characterUpdate);
      }
    },
  );
  listenForUpdate<SortCharacterLeftUpdate>(
    "character-select/sort-character-left",
    (update: SortCharacterLeftUpdate): void => {
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
  listenForUpdate<SortCharacterRightUpdate>(
    "character-select/sort-character-right",
    (update: SortCharacterRightUpdate): void => {
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
  listenForUpdate<CharacterUpdate>(
    "world/enter-character",
    (update: CharacterUpdate): void => {
      loadCharacterUpdate(update);
    },
  );
  listenForUpdate<ExitCharacterUpdate>(
    "world/exit-character",
    (update: ExitCharacterUpdate): void => {
      getDefinable(Character, update.characterID).remove();
    },
  );
  listenForUpdate<MoveCharacterUpdate>(
    "world/move-character",
    (update: MoveCharacterUpdate): void => {
      const character: Character = getDefinable(Character, update.characterID);
      character.move(update.direction);
    },
  );
  listenForUpdate<ExitToMainMenuUpdate>("world/exit-to-main-menu", (): void => {
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
  });
};
