import { State } from "pixel-pigeon";

export interface CharacterCustomizeStateSchema {}
export interface CharacterCreateStateSchema {}
export interface CharacterSelectStateSchema {
  characterIDToDelete: string | null;
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
  characterIDs: string[];
  mainMenuState: State<MainMenuStateSchema> | null;
  serverURL: string | null;
  worldState: State<WorldStateSchema> | null;
}

export const state: State<StateSchema> = new State<StateSchema>({
  battleState: null,
  characterIDs: [],
  mainMenuState: null,
  serverURL: null,
  worldState: null,
});
