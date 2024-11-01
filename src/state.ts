import { Constants, Direction } from "retrommo-types";
import {
  InitialCombinationLockTilePosition,
  InitialNPCTilePosition,
} from "./types/TilePosition";
import { State } from "pixel-pigeon";

export interface MainMenuCharacterCustomizeStateSchema {
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
export interface MainMenuCharacterCreateStateSchema {}
export interface MainMenuCharacterSelectStateSchema {
  isDeleting: boolean;
  isSorting: boolean;
  mainMenuCharacterIDToDelete: string | null;
  page: number;
}
export interface MainMenuStateSchema {
  characterCreateState: State<MainMenuCharacterCreateStateSchema> | null;
  characterCustomizeState: State<MainMenuCharacterCustomizeStateSchema> | null;
  characterSelectState: State<MainMenuCharacterSelectStateSchema> | null;
  mainMenuCharacterIDs: string[];
}
export interface WorldStateSchema {
  worldCharacterID: string;
}
export interface BattleStateSchema {}
interface StateSchema {
  battleState: State<BattleStateSchema> | null;
  constants: Constants | null;
  defaultClothesDyeID: string | null;
  defaultHairDyeID: string | null;
  defaultMaskID: string | null;
  defaultOutfitID: string | null;
  initialCombinationLockTilePositions: readonly InitialCombinationLockTilePosition[];
  initialNPCTilePositions: readonly InitialNPCTilePosition[];
  isSubscribed: boolean;
  mainMenuState: State<MainMenuStateSchema> | null;
  serverURL: string | null;
  worldState: State<WorldStateSchema> | null;
}

export const state: State<StateSchema> = new State<StateSchema>({
  battleState: null,
  constants: null,
  defaultClothesDyeID: null,
  defaultHairDyeID: null,
  defaultMaskID: null,
  defaultOutfitID: null,
  initialCombinationLockTilePositions: [],
  initialNPCTilePositions: [],
  isSubscribed: false,
  mainMenuState: null,
  serverURL: null,
  worldState: null,
});
