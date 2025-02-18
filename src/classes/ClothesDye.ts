import { Class } from "./Class";
import { ClothesColor } from "./ClothesColor";
import { ClothesDyeDefinition } from "retrommo-types";
import { Definable, getDefinable } from "definables";

export interface ClothesDyeOptions {
  readonly id: string;
  readonly definition: ClothesDyeDefinition;
}
export class ClothesDye extends Definable {
  private readonly _classIDs: readonly string[];
  private readonly _isDefault?: boolean;
  private readonly _primaryClothesColorID: string;
  private readonly _secondaryClothesColorID: string;
  public constructor(options: ClothesDyeOptions) {
    super(options.id);
    this._classIDs = options.definition.classIDs;
    this._isDefault = options.definition.isDefault;
    this._primaryClothesColorID = options.definition.primaryClothesColorID;
    this._secondaryClothesColorID = options.definition.secondaryClothesColorID;
  }

  public get classIDs(): readonly string[] {
    return this._classIDs;
  }

  public get classes(): readonly Class[] {
    return this._classIDs.map(
      (classID: string): Class => getDefinable(Class, classID),
    );
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
