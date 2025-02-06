import { Definable, getDefinable } from "definables";
import { Item } from "./Item";

export interface ItemInstanceOptions {
  readonly id: string;
  readonly itemID: string;
}
export class ItemInstance extends Definable {
  private readonly _itemID: string;
  public constructor(options: ItemInstanceOptions) {
    super(options.id);
    this._itemID = options.itemID;
  }

  public get item(): Item {
    return getDefinable(Item, this._itemID);
  }

  public get itemID(): string {
    return this._itemID;
  }
}
