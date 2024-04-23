import { Definable, getDefinable } from "../definables";
import { HairColor } from "./HairColor";
import { HairDyeDefinition } from "retrommo-types";

export interface HairDyeOptions {
  id: string;
  definition: HairDyeDefinition;
}
export class HairDye extends Definable {
  private readonly _hairColorID: string;
  public constructor(options: HairDyeOptions) {
    super(options.id);
    this._hairColorID = options.definition.hairColorID;
  }

  public get hairColor(): HairColor {
    return getDefinable(HairColor, this._hairColorID);
  }
}
