import { MainMenuCharacterSelectStateSchema } from "../../../state";
import { State } from "pixel-pigeon";

export const createMainMenuCharacterSelectState = (
  page: number,
): State<MainMenuCharacterSelectStateSchema> =>
  new State<MainMenuCharacterSelectStateSchema>({
    isDeleting: false,
    isSorting: false,
    mainMenuCharacterIDToDelete: null,
    page,
  });
