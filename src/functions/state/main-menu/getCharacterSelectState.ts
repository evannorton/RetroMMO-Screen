import {
  CharacterSelectStateSchema,
  MainMenuStateSchema,
} from "../../../state";
import { State } from "pixel-pigeon";
import { getMainMenuState } from "./getMainMenuState";

export const getCharacterSelectState =
  (): State<CharacterSelectStateSchema> => {
    const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
    if (mainMenuState.values.characterSelectState === null) {
      throw new Error("characterSelectState is null");
    }
    return mainMenuState.values.characterSelectState;
  };
