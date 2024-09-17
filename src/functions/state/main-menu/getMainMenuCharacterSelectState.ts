import {
  MainMenuCharacterSelectStateSchema,
  MainMenuStateSchema,
} from "../../../state";
import { State } from "pixel-pigeon";
import { getMainMenuState } from "./getMainMenuState";

export const getMainMenuCharacterSelectState =
  (): State<MainMenuCharacterSelectStateSchema> => {
    const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
    if (mainMenuState.values.characterSelectState === null) {
      throw new Error("characterSelectState is null");
    }
    return mainMenuState.values.characterSelectState;
  };
