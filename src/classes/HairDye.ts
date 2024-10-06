import { Definable, getDefinable } from "definables";
import { HairColor } from "./HairColor";
import { HairDyeDefinition } from "retrommo-types";

export interface HairDyeOptions {
  id: string;
  definition: HairDyeDefinition;
}
export class HairDye extends Definable {
  private readonly _hairColorID: string;
  private readonly _isDefault?: boolean;
  public constructor(options: HairDyeOptions) {
    super(options.id);
    this._hairColorID = options.definition.hairColorID;
    this._isDefault = options.definition.isDefault;
  }

  public get hairColor(): HairColor {
    return getDefinable(HairColor, this._hairColorID);
  }

  public get isDefault(): boolean {
    return this._isDefault ?? false;
  }
}
