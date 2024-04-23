import { Definable, getDefinable } from "../definables";
import { ItemDefinition } from "retrommo-types";
import { Mask } from "./Mask";
import { Outfit } from "./Outfit";

export interface ItemOptions {
  definition: ItemDefinition;
  id: string;
}
export class Item extends Definable {
  private readonly _maskID?: string;
  private readonly _outfitID?: string;
  public constructor(options: ItemOptions) {
    super(options.id);
    this._maskID = options.definition.maskID;
    this._outfitID = options.definition.outfitID;
  }

  public get mask(): Mask | undefined {
    if (typeof this._maskID !== "undefined") {
      return getDefinable(Mask, this._maskID);
    }
    return undefined;
  }

  public get outfit(): Outfit | undefined {
    if (typeof this._outfitID !== "undefined") {
      return getDefinable(Outfit, this._outfitID);
    }
    return undefined;
  }
}
