import { getMainMenuState } from "./state/main-menu/getMainMenuState";
import { getMaxCharacters } from "./getMaxCharacters";

export const getLastPlayableCharacterIndex = (): number =>
  Math.min(
    getMainMenuState().values.mainMenuCharacterIDs.length,
    getMaxCharacters(),
  ) - 1;
