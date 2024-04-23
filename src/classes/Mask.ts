import { Definable, getDefinable } from "../definables";
import { HeadCosmetic } from "./HeadCosmetic";
import { MaskDefinition } from "retrommo-types";

export interface MaskOptions {
  definition: MaskDefinition;
  id: string;
}
export class Mask extends Definable {
  private readonly _headCosmeticID: string;
  public constructor(options: MaskOptions) {
    super(options.id);
    this._headCosmeticID = options.definition.headCosmeticID;
  }

  public get headCosmetic(): HeadCosmetic | undefined {
    if (typeof this._headCosmeticID !== "undefined") {
      return getDefinable(HeadCosmetic, this._headCosmeticID);
    }
    return undefined;
  }
}
