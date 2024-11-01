export interface TilePosition {
  readonly x: number;
  readonly y: number;
}
export interface InitialCombinationLockTilePosition {
  readonly combinationLockID: string;
  readonly levelID: string;
  readonly position: TilePosition;
}
export interface InitialNPCTilePosition {
  readonly levelID: string;
  readonly npcID: string;
  readonly position: TilePosition;
}
