import { MainMenuCharacter } from "../../../classes/MainMenuCharacter";
import {
  MainMenuCharacterSelectDeleteCharacterUpdate,
  MainMenuCharacterSelectSelectCharacterUpdate,
  MainMenuCharacterSelectSortCharacterLeftUpdate,
  MainMenuCharacterSelectSortCharacterRightUpdate,
} from "retrommo-types";
import {
  MainMenuCharacterSelectStateSchema,
  MainMenuStateSchema,
  state,
} from "../../../state";
import { State, listenToSocketioEvent } from "pixel-pigeon";
import { createWorldState } from "../../state/createWorldState";
import { getDefinable, getDefinables } from "definables";
import { getLastPlayableCharacterIndex } from "../../getLastPlayableCharacterIndex";
import { getMainMenuCharacterSelectState } from "../../state/main-menu/getMainMenuCharacterSelectState";
import { getMainMenuState } from "../../state/main-menu/getMainMenuState";
import { loadWorldCharacterUpdate } from "../../loadWorldCharacterUpdate";
import { loadWorldPartyUpdate } from "../../loadWorldPartyUpdate";
import { mainMenuCharactersPerPage } from "../../../constants/mainMenuCharactersPerPage";
import { selectWorldCharacter } from "../../selectWorldCharacter";

export const listenForMainMenuCharacterSelectUpdates = (): void => {
  listenToSocketioEvent<MainMenuCharacterSelectDeleteCharacterUpdate>({
    event: "main-menu/character-select/delete-character",
    onMessage: (update: MainMenuCharacterSelectDeleteCharacterUpdate): void => {
      const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
      const characterSelectState: State<MainMenuCharacterSelectStateSchema> =
        getMainMenuCharacterSelectState();
      const character: MainMenuCharacter = getDefinable(
        MainMenuCharacter,
        update.mainMenuCharacterID,
      );
      character.remove();
      const mainMenuCharacterIDs: string[] =
        mainMenuState.values.mainMenuCharacterIDs.filter(
          (mainMenuCharacterID: string): boolean =>
            mainMenuCharacterID !== update.mainMenuCharacterID,
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
  listenToSocketioEvent<MainMenuCharacterSelectSelectCharacterUpdate>({
    event: "main-menu/character-select/select-character",
    onMessage: (update: MainMenuCharacterSelectSelectCharacterUpdate): void => {
      getDefinables(MainMenuCharacter).forEach(
        (mainMenuCharacter: MainMenuCharacter): void => {
          mainMenuCharacter.remove();
        },
      );
      state.setValues({
        mainMenuState: null,
        worldState: createWorldState(update.worldCharacterID),
      });
      for (const worldCharacterUpdate of update.worldCharacters) {
        loadWorldCharacterUpdate(worldCharacterUpdate);
      }
      for (const worldPartyUpdate of update.parties) {
        loadWorldPartyUpdate(worldPartyUpdate);
      }
      selectWorldCharacter(update.worldCharacterID);
    },
  });
  listenToSocketioEvent<MainMenuCharacterSelectSortCharacterLeftUpdate>({
    event: "main-menu/character-select/sort-character-left",
    onMessage: (
      update: MainMenuCharacterSelectSortCharacterLeftUpdate,
    ): void => {
      const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
      const characterIndex: number =
        mainMenuState.values.mainMenuCharacterIDs.indexOf(
          update.mainMenuCharacterID,
        );
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
      mainMenuCharacterIDs[targetIndex] = update.mainMenuCharacterID;
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
        mainMenuState.values.mainMenuCharacterIDs.indexOf(
          update.mainMenuCharacterID,
        );
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
      mainMenuCharacterIDs[targetIndex] = update.mainMenuCharacterID;
      mainMenuCharacterIDs[characterIndex] = targetCharacterID;
      mainMenuState.setValues({ mainMenuCharacterIDs });
    },
  });
};
