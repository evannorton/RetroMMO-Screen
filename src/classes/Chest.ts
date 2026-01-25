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
  private readonly _imagePath: string;
  private readonly _itemID?: string;
  private _openedAt: number | null = null;
  public constructor(options: ChestOptions) {
    super(options.id);
    this._countsTowardTotal = options.definition.countsTowardTotal ?? false;
    this._gold = options.definition.gold;
    this._imagePath = options.definition.imagePath;
    this._itemID = options.definition.itemID;
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

  public get imagePath(): string {
    return this._imagePath;
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

  public get openedAt(): number {
    if (this._openedAt !== null) {
      return this._openedAt;
    }
    throw new Error(this.getAccessorErrorMessage("openedAt"));
  }

  public set openedAt(openedAt: number | null) {
    if (this._openedAt === null) {
      this._openedAt = openedAt;
    }
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
