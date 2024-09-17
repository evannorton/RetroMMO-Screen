import { MainMenuStateSchema } from "../../../state";
import { State } from "pixel-pigeon";
import { createMainMenuCharacterSelectState } from "./createMainMenuCharacterSelectState";

export const createMainMenuState = (
  mainMenuCharacterIDs: string[],
): State<MainMenuStateSchema> =>
  new State<MainMenuStateSchema>({
    characterCreateState: null,
    characterCustomizeState: null,
    characterSelectState: createMainMenuCharacterSelectState(0),
    mainMenuCharacterIDs,
  });
