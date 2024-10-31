import { Definable } from "definables";
import { Direction, NPCDefinition } from "retrommo-types";
import { TilePosition } from "../types/TilePosition";

export interface NPCOptions {
  definition: NPCDefinition;
  id: string;
}
export class NPC extends Definable {
  private readonly _actorImageSourceID: string;
  private _direction: Direction;
  private _entityID: string | null = null;
  private readonly _indicatorImageSourceID: string;
  private readonly _name: string;
  private _position: TilePosition | null = null;
  public constructor(options: NPCOptions) {
    super(options.id);
    this._actorImageSourceID = options.definition.actorImageSourceID;
    this._direction = options.definition.startDirection;
    this._indicatorImageSourceID = options.definition.indicatorImageSourceID;
    this._name = options.definition.name;
  }

  public get actorImageSourceID(): string {
    return this._actorImageSourceID;
  }

  public get direction(): Direction {
    return this._direction;
  }

  public get entityID(): string {
    if (this._entityID !== null) {
      return this._entityID;
    }
    throw new Error(this.getAccessorErrorMessage("entityID"));
  }

  public get indicatorImageSourceID(): string {
    return this._indicatorImageSourceID;
  }

  public get position(): TilePosition {
    if (this._position !== null) {
      return this._position;
    }
    throw new Error(this.getAccessorErrorMessage("position"));
  }

  public set direction(direction: Direction) {
    this._direction = direction;
  }

  public set entityID(entityID: string) {
    this._entityID = entityID;
  }

  public set position(position: TilePosition) {
    this._position = position;
  }
}
