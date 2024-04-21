import { Definable } from "../definables";

export interface BodyCosmeticOptions {
  id: string;
  imagePaths: Record<string, string>;
}
export class BodyCosmetic extends Definable {
  private readonly _imagePaths: Record<string, string>;
  public constructor(options: BodyCosmeticOptions) {
    super(options.id);
    this._imagePaths = options.imagePaths;
  }

  public get imagePaths(): Record<string, string> {
    return this._imagePaths;
  }
}
