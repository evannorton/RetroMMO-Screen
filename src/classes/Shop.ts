import { Definable } from "definables";
import { ShopDefinition } from "retrommo-types";

export interface ShopOptions {
  definition: ShopDefinition;
  id: string;
}
export class Shop extends Definable {
  private readonly _indicatorImagePath: string;
  public constructor(options: ShopOptions) {
    super(options.id);
    this._indicatorImagePath = options.definition.indicatorImageSourceID;
  }

  public get indicatorImagePath(): string {
    return this._indicatorImagePath;
  }
}
