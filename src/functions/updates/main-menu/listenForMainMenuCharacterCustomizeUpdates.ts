import { Character } from "../../../classes/Character";
import { ItemInstance } from "../../../classes/ItemInstance";
import { MainMenuCharacterCustomizeCreateCharacterUpdate } from "retrommo-types";
import { createCharacterSelectState } from "../../state/main-menu/createCharacterSelectState";
import { listenForUpdate } from "../listenForUpdate";
import { state } from "../../../state";

export const listenForMainMenuCharacterCustomizeUpdates = (): void => {
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
};
