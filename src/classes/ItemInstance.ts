import { Definable, getDefinable } from "../definables";
import { Item } from "./Item";

export interface ItemInstanceOptions {
  id: string;
  itemID: string;
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
}
