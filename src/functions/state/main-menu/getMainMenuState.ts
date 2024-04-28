import { MainMenuStateSchema, state } from "../../../state";
import { State } from "pixel-pigeon";

export const getMainMenuState = (): State<MainMenuStateSchema> => {
  if (state.values.mainMenuState === null) {
    throw new Error("mainMenuState is null");
  }
  return state.values.mainMenuState;
};
