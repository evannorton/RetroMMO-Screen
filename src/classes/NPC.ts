import { Definable } from "definables";
import { Direction, NPCDefinition } from "retrommo-types";
import { TilePosition } from "../types/TilePosition";

export interface NPCOptions {
  definition: NPCDefinition;
  id: string;
}
export class NPC extends Definable {
  private readonly _actorImagePath: string;
  private _direction: Direction;
  private _entityID: string | null = null;
  private _indicatorEntityID: string | null = null;
  private readonly _indicatorImagePath: string;
  private readonly _name: string;
  private _position: TilePosition | null = null;
  public constructor(options: NPCOptions) {
    super(options.id);
    this._actorImagePath = options.definition.actorImageSourceID;
    this._direction = options.definition.startDirection;
    this._indicatorImagePath = options.definition.indicatorImageSourceID;
    this._name = options.definition.name;
  }

  public get actorImagePath(): string {
    return this._actorImagePath;
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

  public get indicatorEntityID(): string {
    if (this._indicatorEntityID !== null) {
      return this._indicatorEntityID;
    }
    throw new Error(this.getAccessorErrorMessage("indicatorEntityID"));
  }

  public get indicatorImagePath(): string {
    return this._indicatorImagePath;
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

  public set indicatorEntityID(indicatorEntityID: string) {
    this._indicatorEntityID = indicatorEntityID;
  }

  public set position(position: TilePosition) {
    this._position = position;
  }
}
