import { ClothesDye } from "./ClothesDye";
import { Definable, getDefinable } from "../definables";
import { HairDye } from "./HairDye";
import { ItemDefinition } from "retrommo-types";
import { Mask } from "./Mask";
import { Outfit } from "./Outfit";

export interface ItemOptions {
  definition: ItemDefinition;
  id: string;
}
export class Item extends Definable {
  private readonly _characterCustomizeClothesDyeOrder?: [number, number];
  private readonly _characterCustomizeHairDyeOrder?: number;
  private readonly _characterCustomizeMaskOrder?: number;
  private readonly _characterCustomizeOutfitOrder?: number;
  private readonly _clothesDyeID?: string;
  private readonly _hairDyeID?: string;
  private readonly _maskID?: string;
  private readonly _outfitID?: string;
  public constructor(options: ItemOptions) {
    super(options.id);
    this._characterCustomizeClothesDyeOrder =
      options.definition.characterCustomizeClothesDyeOrder;
    this._characterCustomizeHairDyeOrder =
      options.definition.characterCustomizeHairDyeOrder;
    this._characterCustomizeMaskOrder =
      options.definition.characterCustomizeMaskOrder;
    this._characterCustomizeOutfitOrder =
      options.definition.characterCustomizeOutfitOrder;
    this._clothesDyeID = options.definition.clothesDyeID;
    this._hairDyeID = options.definition.hairDyeID;
    this._maskID = options.definition.maskID;
    this._outfitID = options.definition.outfitID;
  }

  public get characterCustomizeClothesDyeOrder(): [number, number] | undefined {
    return this._characterCustomizeClothesDyeOrder;
  }

  public get characterCustomizeHairDyeOrder(): number | undefined {
    return this._characterCustomizeHairDyeOrder;
  }

  public get characterCustomizeMaskOrder(): number | undefined {
    return this._characterCustomizeMaskOrder;
  }

  public get characterCustomizeOutfitOrder(): number | undefined {
    return this._characterCustomizeOutfitOrder;
  }

  public get clothesDye(): ClothesDye | undefined {
    if (typeof this._clothesDyeID !== "undefined") {
      return getDefinable(ClothesDye, this._clothesDyeID);
    }
    return undefined;
  }

  public get hairDye(): HairDye | undefined {
    if (typeof this._hairDyeID !== "undefined") {
      return getDefinable(HairDye, this._hairDyeID);
    }
    return undefined;
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
