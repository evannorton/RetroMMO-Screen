import { Definable, getDefinable } from "definables";
import { Direction, NPCDefinition } from "retrommo-types";
import { QuestGiver } from "./QuestGiver";
import { Shop } from "./Shop";
import { TilePosition } from "../types/TilePosition";

export interface NPCOptions {
  readonly definition: NPCDefinition;
  readonly id: string;
}
export class NPC extends Definable {
  private readonly _actorImagePath: string;
  private readonly _dialogue?: string;
  private _direction: Direction;
  private readonly _encounterID?: string;
  private _entityID: string | null = null;
  private _indicatorEntityID: string | null = null;
  private readonly _innCost?: number;
  private readonly _name: string;
  private _position: TilePosition | null = null;
  private readonly _questGiverID?: string;
  private readonly _shopID?: string;
  public constructor(options: NPCOptions) {
    super(options.id);
    this._actorImagePath = options.definition.actorImageSourceID;
    this._dialogue = options.definition.dialogue;
    this._direction = options.definition.startDirection;
    this._encounterID = options.definition.encounterID;
    this._innCost = options.definition.innCost;
    this._name = options.definition.name;
    this._questGiverID = options.definition.questGiverID;
    this._shopID = options.definition.shopID;
  }

  public get actorImagePath(): string {
    return this._actorImagePath;
  }

  public get dialogue(): string {
    if (this._dialogue !== undefined) {
      return this._dialogue;
    }
    throw new Error(this.getAccessorErrorMessage("dialogue"));
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

  public get name(): string {
    return this._name;
  }

  public get position(): TilePosition {
    if (this._position !== null) {
      return this._position;
    }
    throw new Error(this.getAccessorErrorMessage("position"));
  }

  public get questGiver(): QuestGiver {
    if (typeof this._questGiverID !== "undefined") {
      return getDefinable(QuestGiver, this._questGiverID);
    }
    throw new Error(this.getAccessorErrorMessage("questGiver"));
  }

  public get shop(): Shop {
    if (typeof this._shopID !== "undefined") {
      return getDefinable(Shop, this._shopID);
    }
    throw new Error(this.getAccessorErrorMessage("shop"));
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

  public hasDialogue(): boolean {
    return typeof this._dialogue !== "undefined";
  }

  public hasInnCost(): boolean {
    return typeof this._innCost !== "undefined";
  }

  public hasQuestGiver(): boolean {
    return typeof this._questGiverID !== "undefined";
  }

  public hasShopID(): boolean {
    return typeof this._shopID !== "undefined";
  }

  public hasEncounterID(): boolean {
    return typeof this._encounterID !== "undefined";
  }
}
