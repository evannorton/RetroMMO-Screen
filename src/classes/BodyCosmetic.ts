import { BodyCosmeticDefinition } from "retrommo-types";
import { Definable } from "definables";

export interface BodyCosmeticOptions {
  readonly definition: BodyCosmeticDefinition;
  readonly id: string;
}
export class BodyCosmetic extends Definable {
  private readonly _imagePaths: Readonly<Record<string, string>>;
  public constructor(options: BodyCosmeticOptions) {
    super(options.id);
    this._imagePaths = options.definition.imagePaths;
  }

  public get imagePaths(): Readonly<Record<string, string>> {
    return this._imagePaths;
  }
}
