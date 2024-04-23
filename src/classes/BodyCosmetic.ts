import { BodyCosmeticDefinition } from "retrommo-types";
import { Definable } from "../definables";

export interface BodyCosmeticOptions {
  definition: BodyCosmeticDefinition;
  id: string;
}
export class BodyCosmetic extends Definable {
  private readonly _imagePaths: Record<string, string>;
  public constructor(options: BodyCosmeticOptions) {
    super(options.id);
    this._imagePaths = options.definition.imageSourcesIDs;
  }

  public get imagePaths(): Record<string, string> {
    return this._imagePaths;
  }
}
