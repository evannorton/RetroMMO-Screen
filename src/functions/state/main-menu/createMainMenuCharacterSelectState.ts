import { MainMenuCharacterSelectStateSchema } from "../../../state";
import { State } from "pixel-pigeon";

export interface CreateMainMenuCharacterSelectStateOptions {
  readonly page: number;
}
export const createMainMenuCharacterSelectState = ({
  page,
}: CreateMainMenuCharacterSelectStateOptions): State<MainMenuCharacterSelectStateSchema> =>
  new State<MainMenuCharacterSelectStateSchema>({
    isDeleting: false,
    isSorting: false,
    mainMenuCharacterIDToDelete: null,
    page,
  });
