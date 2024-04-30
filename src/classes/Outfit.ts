import { BodyCosmetic } from "./BodyCosmetic";
import { Definable, getDefinable } from "../definables";
import { OutfitDefinition } from "retrommo-types";

export interface OutfitOptions {
  definition: OutfitDefinition;
  id: string;
}
export class Outfit extends Definable {
  private readonly _bodyCosmeticID: string;
  private readonly _classIDs: string[];
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

  public get isDefault(): boolean {
    return this._isDefault ?? false;
  }

  public canClassEquip(classID: string): boolean {
    return this._classIDs.includes(classID);
  }
}
