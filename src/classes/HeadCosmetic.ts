import { Definable } from "../definables";
import { HeadCosmeticDefinition } from "retrommo-types";

export interface HeadCosmeticOptions {
  definition: HeadCosmeticDefinition;
  id: string;
}
export class HeadCosmetic extends Definable {
  private readonly _backImagePaths: Record<string, string | undefined>;
  private readonly _frontImagePaths: Record<string, string | undefined>;
  public constructor(options: HeadCosmeticOptions) {
    super(options.id);
    this._backImagePaths = options.definition.backImageSourceIDs;
    this._frontImagePaths = options.definition.frontImageSourceIDs;
  }

  public get backImagePaths(): Record<string, string | undefined> {
    return this._backImagePaths;
  }

  public get frontImagePaths(): Record<string, string | undefined> {
    return this._frontImagePaths;
  }
}
