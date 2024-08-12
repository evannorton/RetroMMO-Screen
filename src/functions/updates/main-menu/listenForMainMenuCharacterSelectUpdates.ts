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
import { listenToSocketioEvent } from "pixel-pigeon";
import { loadWorldCharacterUpdate } from "../../loadWorldCharacterUpdate";
import { selectCharacter } from "../../selectCharacter";
import { state } from "../../../state";
import { updateCharacterParty } from "../../updateCharacterParty";

export const listenForMainMenuCharacterSelectUpdates = (): void => {
  listenToSocketioEvent<MainMenuCharacterSelectDeleteCharacterUpdate>({
    event: "main-menu/character-select/delete-character",
    onMessage: (update: MainMenuCharacterSelectDeleteCharacterUpdate): void => {
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
  });
  listenToSocketioEvent<MainMenuCharacterSelectSelectCharacterUpdate>({
    event: "main-menu/character-select/select-character",
    onMessage: (update: MainMenuCharacterSelectSelectCharacterUpdate): void => {
      state.setValues({
        mainMenuState: null,
        worldState: createWorldState(update.characterID),
      });
      selectCharacter(update.characterID);
      updateCharacterParty(update.characterID, update.partyID);
      for (const characterUpdate of update.characters) {
        loadWorldCharacterUpdate(characterUpdate);
      }
    },
  });
  listenToSocketioEvent<MainMenuCharacterSelectSortCharacterLeftUpdate>({
    event: "main-menu/character-select/sort-character-left",
    onMessage: (
      update: MainMenuCharacterSelectSortCharacterLeftUpdate,
    ): void => {
      const characterIndex: number = state.values.characterIDs.indexOf(
        update.characterID,
      );
      const targetIndex: number =
        characterIndex === 0
          ? getLastPlayableCharacterIndex()
          : characterIndex - 1;
      const targetCharacterID: string | undefined =
        state.values.characterIDs[targetIndex];
      if (typeof targetCharacterID === "undefined") {
        throw new Error("Out of bounds character IDs index");
      }
      const characterIDs: string[] = [...state.values.characterIDs];
      characterIDs[targetIndex] = update.characterID;
      characterIDs[characterIndex] = targetCharacterID;
      state.setValues({ characterIDs });
    },
  });
  listenToSocketioEvent<MainMenuCharacterSelectSortCharacterRightUpdate>({
    event: "main-menu/character-select/sort-character-right",
    onMessage: (
      update: MainMenuCharacterSelectSortCharacterRightUpdate,
    ): void => {
      const characterIndex: number = state.values.characterIDs.indexOf(
        update.characterID,
      );
      const targetIndex: number =
        characterIndex === getLastPlayableCharacterIndex()
          ? 0
          : characterIndex + 1;
      const targetCharacterID: string | undefined =
        state.values.characterIDs[targetIndex];
      if (typeof targetCharacterID === "undefined") {
        throw new Error("Out of bounds character IDs index");
      }
      const characterIDs: string[] = [...state.values.characterIDs];
      characterIDs[targetIndex] = update.characterID;
      characterIDs[characterIndex] = targetCharacterID;
      state.setValues({ characterIDs });
    },
  });
};
