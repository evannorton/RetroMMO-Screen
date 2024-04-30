import { Definable, getDefinable } from "../definables";
import { HeadCosmetic } from "./HeadCosmetic";
import { MaskDefinition } from "retrommo-types";

export interface MaskOptions {
  definition: MaskDefinition;
  id: string;
}
export class Mask extends Definable {
  private readonly _classIDs: string[];
  private readonly _headCosmeticID: string;
  private readonly _isDefault?: boolean;
  public constructor(options: MaskOptions) {
    super(options.id);
    this._classIDs = options.definition.classIDs;
    this._headCosmeticID = options.definition.headCosmeticID;
    this._isDefault = options.definition.isDefault;
  }

  public get headCosmetic(): HeadCosmetic {
    if (typeof this._headCosmeticID !== "undefined") {
      return getDefinable(HeadCosmetic, this._headCosmeticID);
    }
    throw new Error(this.getAccessorErrorMessage("headCosmetic"));
  }

  public get isDefault(): boolean {
    return this._isDefault ?? false;
  }

  public canClassEquip(classID: string): boolean {
    return this._classIDs.includes(classID);
  }
}
