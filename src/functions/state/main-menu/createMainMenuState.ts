import { MainMenuStateSchema } from "../../../state";
import { State } from "pixel-pigeon";
import { createMainMenuCharacterSelectState } from "./createMainMenuCharacterSelectState";

export interface CreateMainMenuStateOptions {
  readonly characterSelectPage: number;
  readonly mainMenuCharacterIDs: readonly string[];
}
export const createMainMenuState = ({
  characterSelectPage,
  mainMenuCharacterIDs,
}: CreateMainMenuStateOptions): State<MainMenuStateSchema> =>
  new State<MainMenuStateSchema>({
    characterCreateState: null,
    characterCustomizeState: null,
    characterSelectState: createMainMenuCharacterSelectState({
      page: characterSelectPage,
    }),
    mainMenuCharacterIDs,
  });
