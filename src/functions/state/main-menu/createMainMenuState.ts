import { MainMenuStateSchema } from "../../../state";
import { State } from "pixel-pigeon";
import { createCharacterSelectState } from "./createCharacterSelectState";

export const createMainMenuState = (): State<MainMenuStateSchema> =>
  new State<MainMenuStateSchema>({
    characterCreateState: null,
    characterCustomizeState: null,
    characterSelectState: createCharacterSelectState(),
  });
