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
  public constructor(options: MaskOptions) {
    super(options.id);
    this._headCosmeticID = options.definition.headCosmeticID;
    this._classIDs = options.definition.classIDs;
  }

  public get headCosmetic(): HeadCosmetic {
    if (typeof this._headCosmeticID !== "undefined") {
      return getDefinable(HeadCosmetic, this._headCosmeticID);
    }
    throw new Error(this.getAccessorErrorMessage("headCosmetic"));
  }

  public canClassEquip(classID: string): boolean {
    return this._classIDs.includes(classID);
  }
}
