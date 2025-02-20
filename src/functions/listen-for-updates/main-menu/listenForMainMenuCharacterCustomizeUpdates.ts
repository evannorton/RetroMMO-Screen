import { MainMenuCharacter } from "../../../classes/MainMenuCharacter";
import { MainMenuCharacterCustomizeCreateCharacterUpdate } from "retrommo-types";
import { MainMenuStateSchema } from "../../../state";
import { State, listenToSocketioEvent } from "pixel-pigeon";
import { createMainMenuCharacterSelectState } from "../../state/main-menu/createMainMenuCharacterSelectState";
import { getMainMenuState } from "../../state/main-menu/getMainMenuState";
import { mainMenuCharactersPerPage } from "../../../constants";

export const listenForMainMenuCharacterCustomizeUpdates = (): void => {
  listenToSocketioEvent<MainMenuCharacterCustomizeCreateCharacterUpdate>({
    event: "main-menu/character-customize/create-character",
    onMessage: (
      update: MainMenuCharacterCustomizeCreateCharacterUpdate,
    ): void => {
      const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
      const mainMenuCharacterID: string = new MainMenuCharacter({
        classID: update.mainMenuCharacter.classID,
        clothesDyeItemID: update.mainMenuCharacter.clothesDyeItemID,
        figureID: update.mainMenuCharacter.figureID,
        hairDyeItemID: update.mainMenuCharacter.hairDyeItemID,
        id: update.mainMenuCharacter.id,
        level: update.mainMenuCharacter.level,
        maskItemID: update.mainMenuCharacter.maskItemID,
        outfitItemID: update.mainMenuCharacter.outfitItemID,
        skinColorID: update.mainMenuCharacter.skinColorID,
      }).id;
      const mainMenuCharacterIDs: string[] = [
        ...mainMenuState.values.mainMenuCharacterIDs,
        mainMenuCharacterID,
      ];
      mainMenuState.setValues({
        characterCustomizeState: null,
        characterSelectState: createMainMenuCharacterSelectState({
          page: Math.floor(
            (mainMenuCharacterIDs.length - 1) / mainMenuCharactersPerPage,
          ),
        }),
        mainMenuCharacterIDs,
      });
    },
  });
};
