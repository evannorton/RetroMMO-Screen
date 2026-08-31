import { ChestDefinition } from "retrommo-types";
import { Definable, getDefinable } from "definables";
import { Item } from "./Item";

export interface ChestOptions {
  readonly definition: ChestDefinition;
  readonly id: string;
}
export class Chest extends Definable {
  private readonly _countsTowardTotal: boolean;
  private readonly _gold?: number;
  private readonly _itemID?: string;
  private readonly _mapImagePath: string;
  private _openedAt: number | null = null;
  private readonly _panelImagePath: string;
  public constructor(options: ChestOptions) {
    super(options.id);
    this._countsTowardTotal = options.definition.countsTowardTotal ?? false;
    this._gold = options.definition.gold;
    this._itemID = options.definition.itemID;
    this._mapImagePath = options.definition.mapImagePath;
    this._panelImagePath = options.definition.panelImagePath;
  }

  public get countsTowardTotal(): boolean {
    return this._countsTowardTotal;
  }

  public get gold(): number {
    if (typeof this._gold !== "undefined") {
      return this._gold;
    }
    throw new Error(this.getAccessorErrorMessage("gold"));
  }

  public get item(): Item {
    if (typeof this._itemID !== "undefined") {
      return getDefinable(Item, this._itemID);
    }
    throw new Error(this.getAccessorErrorMessage("item"));
  }

  public get itemID(): string {
    if (typeof this._itemID !== "undefined") {
      return this._itemID;
    }
    throw new Error(this.getAccessorErrorMessage("itemID"));
  }

  public get mapImagePath(): string {
    return this._mapImagePath;
  }

  public get openedAt(): number {
    if (this._openedAt !== null) {
      return this._openedAt;
    }
    throw new Error(this.getAccessorErrorMessage("openedAt"));
  }

  public get panelImagePath(): string {
    return this._panelImagePath;
  }

  public set openedAt(openedAt: number | null) {
    this._openedAt = openedAt;
  }

  public hasGold(): boolean {
    return typeof this._gold !== "undefined";
  }

  public hasItem(): boolean {
    return typeof this._itemID !== "undefined";
  }

  public hasOpenedAt(): boolean {
    return this._openedAt !== null;
  }
}
