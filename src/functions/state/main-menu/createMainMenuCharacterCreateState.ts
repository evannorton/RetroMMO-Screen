import { MainMenuCharacterCreateStateSchema } from "../../../state";
import { State } from "pixel-pigeon";

export const createMainMenuCharacterCreateState =
  (): State<MainMenuCharacterCreateStateSchema> =>
    new State<MainMenuCharacterCreateStateSchema>({});
