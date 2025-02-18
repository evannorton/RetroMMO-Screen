import { BodyCosmetic } from "./BodyCosmetic";
import { Class } from "./Class";
import { Definable, getDefinable } from "definables";
import { OutfitDefinition } from "retrommo-types";

export interface OutfitOptions {
  readonly definition: OutfitDefinition;
  readonly id: string;
}
export class Outfit extends Definable {
  private readonly _bodyCosmeticID: string;
  private readonly _classIDs: readonly string[];
  private readonly _isDefault?: boolean;
  public constructor(options: OutfitOptions) {
    super(options.id);
    this._bodyCosmeticID = options.definition.bodyCosmeticID;
    this._classIDs = options.definition.classIDs;
    this._isDefault = options.definition.isDefault;
  }

  public get bodyCosmetic(): BodyCosmetic {
    if (typeof this._bodyCosmeticID !== "undefined") {
      return getDefinable(BodyCosmetic, this._bodyCosmeticID);
    }
    throw new Error(this.getAccessorErrorMessage("bodyCosmetic"));
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

  public canClassEquip(classID: string): boolean {
    return this._classIDs.includes(classID);
  }
}
