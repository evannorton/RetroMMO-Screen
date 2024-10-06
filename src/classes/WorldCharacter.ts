import { Class } from "./Class";
import { Definable, getDefinable } from "definables";
import { Direction } from "retrommo-types";
import { Figure } from "./Figure";
import { Item } from "./Item";
import { Party } from "./Party";
import { SkinColor } from "./SkinColor";
import { removeEntity } from "pixel-pigeon";

export interface WorldCharacterOptionsResources {
  hp: number;
  maxHP: number;
  maxMP?: number;
  mp?: number;
}
export interface WorldCharacterOptions {
  classID: string;
  clothesDyeItemID?: string;
  direction: Direction;
  figureID: string;
  hairDyeItemID?: string;
  id: string;
  level: number;
  maskItemID?: string;
  order: number;
  outfitItemID?: string;
  partyID: string;
  resources?: WorldCharacterOptionsResources;
  skinColorID: string;
  tilemapID: string;
  userID: number;
  username: string;
  x: number;
  y: number;
}
export interface WorldCharacterResources {
  hp: number;
  maxHP: number;
  maxMP: number | null;
  mp: number | null;
}
export class WorldCharacter extends Definable {
  private readonly _classID: string;
  private readonly _clothesDyeItemID: string | null;
  private _direction: Direction;
  private readonly _figureID: string;
  private _entityID: string | null = null;
  private readonly _hairDyeItemID: string | null;
  private readonly _level: number;
  private readonly _maskItemID: string | null;
  private _order: number;
  private readonly _outfitItemID: string | null;
  private _partyID: string;
  private readonly _resources: WorldCharacterResources | null;
  private readonly _skinColorID: string;
  private _tilemapID: string;
  private readonly _userID: number;
  private readonly _username: string;
  private _x: number;
  private _y: number;
  public constructor(options: WorldCharacterOptions) {
    super(options.id);
    this._classID = options.classID;
    this._clothesDyeItemID = options.clothesDyeItemID ?? null;
    this._direction = options.direction;
    this._figureID = options.figureID;
    this._hairDyeItemID = options.hairDyeItemID ?? null;
    this._level = options.level;
    this._maskItemID = options.maskItemID ?? null;
    this._order = options.order;
    this._outfitItemID = options.outfitItemID ?? null;
    this._partyID = options.partyID;
    this._resources =
      typeof options.resources !== "undefined"
        ? {
            hp: options.resources.hp,
            maxHP: options.resources.maxHP,
            maxMP: options.resources.maxMP ?? null,
            mp: options.resources.mp ?? null,
          }
        : null;
    this._skinColorID = options.skinColorID;
    this._tilemapID = options.tilemapID;
    this._userID = options.userID;
    this._username = options.username;
    this._x = options.x;
    this._y = options.y;
  }

  public get class(): Class {
    return getDefinable(Class, this._classID);
  }

  public get clothesDyeItem(): Item {
    if (this._clothesDyeItemID !== null) {
      return getDefinable(Item, this._clothesDyeItemID);
    }
    throw new Error(this.getAccessorErrorMessage("clothesDyeItem"));
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

  public get figure(): Figure {
    return getDefinable(Figure, this._figureID);
  }

  public get hairDyeItem(): Item {
    if (this._hairDyeItemID !== null) {
      return getDefinable(Item, this._hairDyeItemID);
    }
    throw new Error(this.getAccessorErrorMessage("hairDyeItem"));
  }

  public get maskItem(): Item {
    if (this._maskItemID !== null) {
      return getDefinable(Item, this._maskItemID);
    }
    throw new Error(this.getAccessorErrorMessage("maskItem"));
  }

  public get order(): number {
    return this._order;
  }

  public get party(): Party {
    return getDefinable(Party, this._partyID);
  }

  public get outfitItem(): Item {
    if (this._outfitItemID !== null) {
      return getDefinable(Item, this._outfitItemID);
    }
    throw new Error(this.getAccessorErrorMessage("outfitItem"));
  }

  public get resources(): WorldCharacterResources {
    if (this._resources !== null) {
      return this._resources;
    }
    throw new Error(this.getAccessorErrorMessage("resources"));
  }

  public get skinColor(): SkinColor {
    return getDefinable(SkinColor, this._skinColorID);
  }

  public get tilemapID(): string {
    return this._tilemapID;
  }

  public get username(): string {
    return this._username;
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public set party(party: Party) {
    this._partyID = party.id;
  }

  public set x(x: number) {
    this._x = x;
  }

  public set y(y: number) {
    this._y = y;
  }

  public set direction(direction: Direction) {
    this._direction = direction;
  }

  public set entityID(entityID: string) {
    this._entityID = entityID;
  }

  public set order(order: number) {
    this._order = order;
  }

  public set tilemapID(tilemapID: string) {
    this._tilemapID = tilemapID;
  }

  public hasClothesDyeItem(): boolean {
    return this._clothesDyeItemID !== null;
  }

  public hasHairDyeItem(): boolean {
    return this._hairDyeItemID !== null;
  }

  public hasMaskItem(): boolean {
    return this._maskItemID !== null;
  }

  public hasOutfitItem(): boolean {
    return this._outfitItemID !== null;
  }

  public remove(): void {
    if (this._entityID !== null) {
      removeEntity(this._entityID);
    }
    super.remove();
  }
}
