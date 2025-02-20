import { Definable } from "definables";
import { ShopDefinition } from "retrommo-types";

export interface ShopOptions {
  readonly definition: ShopDefinition;
  readonly id: string;
}
export class Shop extends Definable {
  private readonly _indicatorImagePath: string;
  public constructor(options: ShopOptions) {
    super(options.id);
    this._indicatorImagePath = options.definition.indicatorImagePath;
  }

  public get indicatorImagePath(): string {
    return this._indicatorImagePath;
  }
}
