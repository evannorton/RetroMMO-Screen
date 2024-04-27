import { state } from "../../../state";

export const createCharacterCustomizeUI = (): void => {
  const condition = (): boolean =>
    state.values.mainMenuState !== null &&
    state.values.mainMenuState.values.characterCustomizeState !== null;
  console.log(condition);
};
