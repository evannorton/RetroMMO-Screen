import { Direction } from "retrommo-types";
import { State } from "pixel-pigeon";

export interface CharacterCustomizeStateSchema {
  classID: string;
  clothesDyeItemPrimaryColorIndex: number;
  clothesDyeItemSecondaryColorIndex: number;
  direction: Direction;
  figureIndex: number;
  hairDyeItemIndex: number;
  maskItemIndex: number;
  outfitItemIndex: number;
  skinColorIndex: number;
}
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
  defaultClothesDyeID: string | null;
  defaultHairDyeID: string | null;
  defaultMaskID: string | null;
  defaultOutfitID: string | null;
  mainMenuState: State<MainMenuStateSchema> | null;
  serverURL: string | null;
  worldState: State<WorldStateSchema> | null;
}

export const state: State<StateSchema> = new State<StateSchema>({
  battleState: null,
  characterIDs: [],
  defaultClothesDyeID: null,
  defaultHairDyeID: null,
  defaultMaskID: null,
  defaultOutfitID: null,
  mainMenuState: null,
  serverURL: null,
  worldState: null,
});
