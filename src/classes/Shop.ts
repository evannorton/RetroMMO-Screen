import { Definable } from "definables";
import { ShopDefinition, ShopItemDefinition } from "retrommo-types";

export interface ShopOptions {
  readonly definition: ShopDefinition;
  readonly id: string;
}
export interface ShopItem {
  readonly cost: number;
  readonly itemID: string;
}
export class Shop extends Definable {
  private readonly _indicatorImagePath: string;
  private readonly _shopItems: readonly ShopItem[];
  public constructor(options: ShopOptions) {
    super(options.id);
    this._indicatorImagePath = options.definition.indicatorImagePath;
    this._shopItems = options.definition.shopItems.map(
      (shopItem: ShopItemDefinition): ShopItem => ({
        cost: shopItem.cost,
        itemID: shopItem.itemID,
      }),
    );
  }

  public get indicatorImagePath(): string {
    return this._indicatorImagePath;
  }

  public get shopItems(): readonly ShopItem[] {
    return this._shopItems;
  }
}
