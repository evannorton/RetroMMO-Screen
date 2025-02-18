import { Class } from "./Class";
import { Definable, getDefinable } from "definables";
import { HairColor } from "./HairColor";
import { HairDyeDefinition } from "retrommo-types";

export interface HairDyeOptions {
  readonly definition: HairDyeDefinition;
  readonly id: string;
}
export class HairDye extends Definable {
  private readonly _classIDs: readonly string[];
  private readonly _hairColorID: string;
  private readonly _isDefault?: boolean;
  public constructor(options: HairDyeOptions) {
    super(options.id);
    this._classIDs = options.definition.classIDs;
    this._hairColorID = options.definition.hairColorID;
    this._isDefault = options.definition.isDefault;
  }

  public get classIDs(): readonly string[] {
    return this._classIDs;
  }

  public get classes(): readonly Class[] {
    return this._classIDs.map(
      (classID: string): Class => getDefinable(Class, classID),
    );
  }

  public get hairColor(): HairColor {
    return getDefinable(HairColor, this._hairColorID);
  }

  public get isDefault(): boolean {
    return this._isDefault ?? false;
  }
}
