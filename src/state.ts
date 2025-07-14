import {
  BattleEvent,
  BattlePhase,
  BattleType,
  Constants,
  Direction,
} from "retrommo-types";
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
import { MapMusicPause } from "./types/MapMusicPause";
import { PianoNote } from "./types/PianoNote";
import { TimePlayed } from "./types/TimePlayed";

export interface MainMenuCharacterCustomizeStateSchema {
  readonly classID: string;
  readonly clothesDyeItemPrimaryColorIndex: number;
  readonly clothesDyeItemSecondaryColorIndex: number;
  readonly direction: Direction;
  readonly figureIndex: number;
  readonly hairDyeItemIndex: number;
  readonly maskItemIndex: number;
  readonly outfitItemIndex: number;
  readonly skinColorIndex: number;
}
export interface MainMenuCharacterCreateStateSchema {}
export interface MainMenuCharacterSelectStateSchema {
  readonly isDeleting: boolean;
  readonly isSorting: boolean;
  readonly mainMenuCharacterIDToDelete: string | null;
  readonly page: number;
}
export interface MainMenuStateSchema {
  readonly characterCreateState: State<MainMenuCharacterCreateStateSchema> | null;
  readonly characterCustomizeState: State<MainMenuCharacterCustomizeStateSchema> | null;
  readonly characterSelectState: State<MainMenuCharacterSelectStateSchema> | null;
  readonly mainMenuCharacterIDs: readonly string[];
}
export interface WorldStateSchema {
  readonly agility: number;
  readonly bagItemInstanceIDs: readonly string[];
  readonly bodyItemInstanceID: string | null;
  readonly boostItemInstanceIDs: readonly string[];
  readonly clothesDyeItemInstanceID: string | null;
  readonly defense: number;
  readonly experienceUntilLevel: number | null;
  readonly hairDyeItemInstanceID: string | null;
  readonly headItemInstanceID: string | null;
  readonly intelligence: number;
  readonly inventoryGold: number;
  readonly lastPianoNoteAt: number | null;
  readonly lastUsedEmoteID: string | null;
  readonly luck: number;
  readonly mainHandItemInstanceID: string | null;
  readonly maskItemInstanceID: string | null;
  readonly offHandItemInstanceID: string | null;
  readonly outfitItemInstanceID: string | null;
  readonly pianoNotes: readonly PianoNote[];
  readonly pianoSessionID: string | null;
  readonly reachableID: string;
  readonly strength: number;
  readonly timePlayed: TimePlayed;
  readonly wisdom: number;
  readonly worldCharacterID: string;
}
export interface BattleStateRoundEventInstance {
  readonly event: BattleEvent;
  isProcessed: boolean;
}
export interface BattleStateRound {
  readonly duration: number;
  readonly isFinal: boolean;
  readonly eventInstances: readonly BattleStateRoundEventInstance[];
  readonly serverTime: number;
}
export interface BattleStateSelection {
  abilitiesPage: number;
  bindAction: BattleStateBindAction | null;
  isUsingAction: boolean;
  itemInstanceIDs: readonly string[];
  itemsPage: number;
  menuState: BattleMenuState;
  queuedAction: BattleStateQueuedAction | null;
  selectedAbilityIndex: number | null;
  selectedItemInstanceIndex: number | null;
  readonly serverTime: number;
  unbindStartedAt: number | null;
}
export interface BattleStateQueuedAction {
  readonly actionDefinableReference: DefinableReference;
  readonly queuedAt: number;
}
export interface BattleStateBindAction {
  readonly bindStartedAt: number;
  readonly hotkeyableDefinableReference: DefinableReference;
}
export enum BattleMenuState {
  Default = "default",
  Abilities = "abilities",
  Items = "items",
}
export interface BattleStateHotkey {
  readonly hotkeyableDefinableReference: DefinableReference;
  readonly index: number;
}
export interface BattleStateSchema {
  readonly battlerID: string;
  readonly enemyBattlerIDs: readonly string[];
  readonly enemyBattlersCount: number;
  readonly friendlyBattlerIDs: readonly string[];
  readonly friendlyBattlersCount: number;
  readonly hotkeys: readonly BattleStateHotkey[];
  readonly hudElementReferences: HUDElementReferences;
  readonly impactAnimationSpriteIDs: readonly string[];
  readonly isFadingOutMusic: boolean;
  readonly phase: BattlePhase;
  readonly reachableID: string;
  readonly round: BattleStateRound | null;
  readonly selection: BattleStateSelection | null;
  readonly teamIndex: 0 | 1;
  readonly type: BattleType;
}
export interface StateSchema {
  readonly battleState: State<BattleStateSchema> | null;
  readonly constants: Constants | null;
  readonly defaultClothesDyeID: string | null;
  readonly defaultHairDyeID: string | null;
  readonly defaultMaskID: string | null;
  readonly defaultOutfitID: string | null;
  readonly initialBankTilePositions: readonly InitialBankTilePosition[];
  readonly initialChestTilePositions: readonly InitialChestTilePosition[];
  readonly initialCombinationLockTilePositions: readonly InitialCombinationLockTilePosition[];
  readonly initialEnterableTilePositions: readonly InitialEnterableTilePosition[];
  readonly initialNPCExtenderPositions: readonly InitialNPCExtenderPosition[];
  readonly initialNPCTilePositions: readonly InitialNPCTilePosition[];
  readonly initialPianoTilePositions: readonly InitialPianoTilePosition[];
  readonly isInitialUpdateReceived: boolean;
  readonly isSubscribed: boolean;
  readonly mainMenuState: State<MainMenuStateSchema> | null;
  readonly mapMusicPause: MapMusicPause | null;
  readonly musicTrackID: string | null;
  readonly pianoStartedAt: number | null;
  readonly selectedPlayerID: string | null;
  readonly serverTime: number | null;
  readonly serverTimeRequestedAt: number | null;
  readonly serverURL: string | null;
  readonly worldState: State<WorldStateSchema> | null;
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
  isInitialUpdateReceived: false,
  isSubscribed: false,
  mainMenuState: null,
  mapMusicPause: null,
  musicTrackID: null,
  pianoStartedAt: null,
  selectedPlayerID: null,
  serverTime: null,
  serverTimeRequestedAt: null,
  serverURL: null,
  worldState: null,
});
