import { Savefile } from "retrommo-types";
import { State } from "pixel-pigeon";

export interface CharacterCustomizeStateSchema {}
export interface CharacterCreateStateSchema {}
export interface CharacterSelectStateSchema {
  isDeleting: boolean;
  isSorting: boolean;
  page: number;
}
export interface MainMenuStateSchema {
  characterCreateState: State<CharacterCreateStateSchema> | null;
  characterCustomizeState: State<CharacterCustomizeStateSchema> | null;
  characterSelectState: State<CharacterSelectStateSchema> | null;
}
export interface WorldStateSchema {}
export interface BattleStateSchema {}
interface StateSchema {
  battleState: State<BattleStateSchema> | null;
  mainMenuState: State<MainMenuStateSchema> | null;
  savefile: Savefile | null;
  serverURL: string | null;
  worldState: State<WorldStateSchema> | null;
}

export const state: State<StateSchema> = new State<StateSchema>({
  battleState: null,
  mainMenuState: null,
  savefile: null,
  serverURL: null,
  worldState: null,
});
