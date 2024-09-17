import {
  MainMenuCharacterCustomizeStateSchema,
  MainMenuStateSchema,
} from "../../../state";
import { State } from "pixel-pigeon";
import { getMainMenuState } from "./getMainMenuState";

export const getMainMenuCharacterCustomizeState =
  (): State<MainMenuCharacterCustomizeStateSchema> => {
    const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
    if (mainMenuState.values.characterCustomizeState === null) {
      throw new Error("characterCustomizeState is null");
    }
    return mainMenuState.values.characterCustomizeState;
  };
