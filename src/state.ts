import { Constants, Direction } from "retrommo-types";
import { DefinableReference } from "definables";
import { HUDElementReferences, State } from "pixel-pigeon";
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
import { TimePlayed } from "./types/TimePlayed";

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
  mainMenuCharacterIDs: readonly string[];
}
export interface WorldStateSchema {
  agility: number;
  bagItemInstanceIDs: readonly string[];
  bodyItemInstanceID: string | null;
  boostItemInstanceIDs: readonly string[];
  clothesDyeItemInstanceID: string | null;
  defense: number;
  experienceUntilLevel: number | null;
  hairDyeItemInstanceID: string | null;
  headItemInstanceID: string | null;
  intelligence: number;
  inventoryGold: number;
  lastPianoNoteAt: number | null;
  lastUsedEmoteID: string | null;
  luck: number;
  mainHandItemInstanceID: string | null;
  maskItemInstanceID: string | null;
  offHandItemInstanceID: string | null;
  outfitItemInstanceID: string | null;
  pianoNotes: readonly PianoNote[];
  pianoSessionID: string | null;
  strength: number;
  timePlayed: TimePlayed;
  wisdom: number;
  worldCharacterID: string;
}
export interface BattleStateQueuedAction {
  readonly actionDefinableReference: DefinableReference;
  readonly queuedAt: number;
}
export enum BattleMenuState {
  Default = "default",
  Abilities = "abilities",
  Items = "items",
}
export interface BattleStateSchema {
  abilitiesPage: number;
  battlerID: string;
  enemyBattlerIDs: readonly string[];
  friendlyBattlerIDs: readonly string[];
  hudElementReferences: HUDElementReferences;
  itemInstanceIDs: readonly string[];
  itemsPage: number;
  menuState: BattleMenuState;
  queuedAction: BattleStateQueuedAction | null;
  reachableID: string;
  selectedAbilityIndex: number | null;
  selectedItemInstanceIndex: number | null;
}
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
  selectedPlayerID: string | null;
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
  selectedPlayerID: null,
  serverURL: null,
  worldState: null,
});
