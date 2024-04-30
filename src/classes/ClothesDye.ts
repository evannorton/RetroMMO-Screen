import { ClothesColor } from "./ClothesColor";
import { ClothesDyeDefinition } from "retrommo-types";
import { Definable, getDefinable } from "../definables";

export interface ClothesDyeOptions {
  id: string;
  definition: ClothesDyeDefinition;
}
export class ClothesDye extends Definable {
  private readonly _isDefault?: boolean;
  private readonly _primaryClothesColorID: string;
  private readonly _secondaryClothesColorID: string;
  public constructor(options: ClothesDyeOptions) {
    super(options.id);
    this._isDefault = options.definition.isDefault;
    this._primaryClothesColorID = options.definition.primaryClothesColorID;
    this._secondaryClothesColorID = options.definition.secondaryClothesColorID;
  }

  public get isDefault(): boolean {
    return this._isDefault ?? false;
  }

  public get primaryClothesColor(): ClothesColor {
    return getDefinable(ClothesColor, this._primaryClothesColorID);
  }

  public get secondaryClothesColor(): ClothesColor {
    return getDefinable(ClothesColor, this._secondaryClothesColorID);
  }
}
