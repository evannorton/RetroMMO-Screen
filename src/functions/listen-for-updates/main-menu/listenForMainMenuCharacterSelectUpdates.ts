import { MainMenuCharacter } from "../../../classes/MainMenuCharacter";
import {
  MainMenuCharacterSelectDeleteCharacterUpdate,
  MainMenuCharacterSelectSortCharacterLeftUpdate,
  MainMenuCharacterSelectSortCharacterRightUpdate,
} from "retrommo-types";
import {
  MainMenuCharacterSelectStateSchema,
  MainMenuStateSchema,
} from "../../../state";
import { State, listenToSocketioEvent } from "pixel-pigeon";
import { getDefinable } from "definables";
import { getLastPlayableCharacterIndex } from "../../getLastPlayableCharacterIndex";
import { getMainMenuCharacterSelectState } from "../../state/main-menu/getMainMenuCharacterSelectState";
import { getMainMenuState } from "../../state/main-menu/getMainMenuState";
import { mainMenuCharactersPerPage } from "../../../constants";

export const listenForMainMenuCharacterSelectUpdates = (): void => {
  listenToSocketioEvent<MainMenuCharacterSelectDeleteCharacterUpdate>({
    event: "main-menu/character-select/delete-character",
    onMessage: (update: MainMenuCharacterSelectDeleteCharacterUpdate): void => {
      const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
      const characterSelectState: State<MainMenuCharacterSelectStateSchema> =
        getMainMenuCharacterSelectState();
      const character: MainMenuCharacter = getDefinable(
        MainMenuCharacter,
        update.characterID,
      );
      character.remove();
      const mainMenuCharacterIDs: string[] =
        mainMenuState.values.mainMenuCharacterIDs.filter(
          (mainMenuCharacterID: string): boolean =>
            mainMenuCharacterID !== update.characterID,
        );
      const thresholdCharactersAmount: number =
        characterSelectState.values.page * mainMenuCharactersPerPage;
      const page: number = Math.max(
        mainMenuCharacterIDs.length <= thresholdCharactersAmount
          ? characterSelectState.values.page - 1
          : characterSelectState.values.page,
        0,
      );
      characterSelectState.setValues({
        isDeleting: false,
        mainMenuCharacterIDToDelete: null,
        page,
      });
      mainMenuState.setValues({
        mainMenuCharacterIDs,
      });
    },
  });
  listenToSocketioEvent<MainMenuCharacterSelectSortCharacterLeftUpdate>({
    event: "main-menu/character-select/sort-character-left",
    onMessage: (
      update: MainMenuCharacterSelectSortCharacterLeftUpdate,
    ): void => {
      const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
      const characterIndex: number =
        mainMenuState.values.mainMenuCharacterIDs.indexOf(update.characterID);
      const targetIndex: number =
        characterIndex === 0
          ? getLastPlayableCharacterIndex()
          : characterIndex - 1;
      const targetCharacterID: string | undefined =
        mainMenuState.values.mainMenuCharacterIDs[targetIndex];
      if (typeof targetCharacterID === "undefined") {
        throw new Error("Out of bounds character IDs index");
      }
      const mainMenuCharacterIDs: string[] = [
        ...mainMenuState.values.mainMenuCharacterIDs,
      ];
      mainMenuCharacterIDs[targetIndex] = update.characterID;
      mainMenuCharacterIDs[characterIndex] = targetCharacterID;
      mainMenuState.setValues({ mainMenuCharacterIDs });
    },
  });
  listenToSocketioEvent<MainMenuCharacterSelectSortCharacterRightUpdate>({
    event: "main-menu/character-select/sort-character-right",
    onMessage: (
      update: MainMenuCharacterSelectSortCharacterRightUpdate,
    ): void => {
      const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
      const characterIndex: number =
        mainMenuState.values.mainMenuCharacterIDs.indexOf(update.characterID);
      const targetIndex: number =
        characterIndex === getLastPlayableCharacterIndex()
          ? 0
          : characterIndex + 1;
      const targetCharacterID: string | undefined =
        mainMenuState.values.mainMenuCharacterIDs[targetIndex];
      if (typeof targetCharacterID === "undefined") {
        throw new Error("Out of bounds character IDs index");
      }
      const mainMenuCharacterIDs: string[] = [
        ...mainMenuState.values.mainMenuCharacterIDs,
      ];
      mainMenuCharacterIDs[targetIndex] = update.characterID;
      mainMenuCharacterIDs[characterIndex] = targetCharacterID;
      mainMenuState.setValues({ mainMenuCharacterIDs });
    },
  });
};
