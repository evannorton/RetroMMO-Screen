export interface TilePosition {
  readonly x: number;
  readonly y: number;
}
export interface InitialBankTilePosition {
  readonly bankID: string;
  readonly levelID: string;
  readonly position: TilePosition;
}
export interface InitialChestTilePosition {
  readonly chestID: string;
  readonly levelID: string;
  readonly position: TilePosition;
}
export interface InitialEnterableTilePosition {
  readonly enterableID: string;
  readonly levelID: string;
  readonly position: TilePosition;
}
export interface InitialNPCExtenderPosition {
  readonly levelID: string;
  readonly position: TilePosition;
}
export interface InitialNPCTilePosition {
  readonly levelID: string;
  readonly npcID: string;
  readonly position: TilePosition;
}
export interface InitialPianoTilePosition {
  readonly levelID: string;
  readonly pianoID: string;
  readonly position: TilePosition;
}
