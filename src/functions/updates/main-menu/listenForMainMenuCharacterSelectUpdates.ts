import { Character } from "../../../classes/Character";
import {
  MainMenuCharacterSelectDeleteCharacterUpdate,
  MainMenuCharacterSelectSelectCharacterUpdate,
  MainMenuCharacterSelectSortCharacterLeftUpdate,
  MainMenuCharacterSelectSortCharacterRightUpdate,
} from "retrommo-types";
import { createWorldState } from "../../state/createWorldState";
import { getCharacterSelectState } from "../../state/main-menu/getCharacterSelectState";
import { getDefinable } from "../../../definables";
import { getLastPlayableCharacterIndex } from "../../getLastPlayableCharacterIndex";
import { listenForUpdate } from "../listenForUpdate";
import { loadWorldCharacterUpdate } from "../../loadWorldCharacterUpdate";
import { state } from "../../../state";

export const listenForMainMenuCharacterSelectUpdates = (): void => {
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
};
