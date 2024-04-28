import {
  CharacterCustomizeStateSchema,
  MainMenuStateSchema,
} from "../../../state";
import { State } from "pixel-pigeon";
import { getMainMenuState } from "./getMainMenuState";

export const getCharacterCustomizeState =
  (): State<CharacterCustomizeStateSchema> => {
    const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
    if (mainMenuState.values.characterCustomizeState === null) {
      throw new Error("characterCustomizeState is null");
    }
    return mainMenuState.values.characterCustomizeState;
  };
