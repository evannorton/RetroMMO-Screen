import { Constants, Direction } from "retrommo-types";
import {
  InitialBankTilePosition,
  InitialChestTilePosition,
  InitialCombinationLockTilePosition,
  InitialEnterableTilePosition,
  InitialNPCExtenderPosition,
  InitialNPCTilePosition,
  InitialPianoTilePosition,
} from "./types/TilePosition";
import { PianoNote } from "./types/PianoNote";
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
  bagItemInstanceIDs: readonly string[];
  lastPianoNoteAt: number | null;
  lastUsedEmoteID: string | null;
  pianoNotes: readonly PianoNote[];
  pianoSessionID: string | null;
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
  initialBankTilePositions: readonly InitialBankTilePosition[];
  initialChestTilePositions: readonly InitialChestTilePosition[];
  initialCombinationLockTilePositions: readonly InitialCombinationLockTilePosition[];
  initialEnterableTilePositions: readonly InitialEnterableTilePosition[];
  initialNPCExtenderPositions: readonly InitialNPCExtenderPosition[];
  initialNPCTilePositions: readonly InitialNPCTilePosition[];
  initialPianoTilePositions: readonly InitialPianoTilePosition[];
  isSubscribed: boolean;
  mainMenuState: State<MainMenuStateSchema> | null;
  pianoStartedAt: number | null;
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
  initialBankTilePositions: [],
  initialChestTilePositions: [],
  initialCombinationLockTilePositions: [],
  initialEnterableTilePositions: [],
  initialNPCExtenderPositions: [],
  initialNPCTilePositions: [],
  initialPianoTilePositions: [],
  isSubscribed: false,
  mainMenuState: null,
  pianoStartedAt: null,
  serverURL: null,
  worldState: null,
});
