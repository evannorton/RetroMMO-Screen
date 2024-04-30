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
  public constructor(options: OutfitOptions) {
    super(options.id);
    this._bodyCosmeticID = options.definition.bodyCosmeticID;
    this._classIDs = options.definition.classIDs;
  }

  public get bodyCosmetic(): BodyCosmetic {
    if (typeof this._bodyCosmeticID !== "undefined") {
      return getDefinable(BodyCosmetic, this._bodyCosmeticID);
    }
    throw new Error(this.getAccessorErrorMessage("bodyCosmetic"));
  }

  public canClassEquip(classID: string): boolean {
    return this._classIDs.includes(classID);
  }
}
