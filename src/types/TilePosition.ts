export interface TilePosition {
  readonly x: number;
  readonly y: number;
}
export interface InitialNPCTilePosition {
  readonly levelID: string;
  readonly npcID: string;
  readonly position: TilePosition;
}
