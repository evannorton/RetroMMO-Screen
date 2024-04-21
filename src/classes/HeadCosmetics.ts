import { Definable } from "../definables";

export interface HeadCosmeticOptions {
  backImagePaths: Record<string, string | null>;
  frontImagePaths: Record<string, string | null>;
  id: string;
}
export class HeadCosmetic extends Definable {
  private readonly _backImagePaths: Record<string, string | null>;
  private readonly _frontImagePaths: Record<string, string | null>;
  public constructor(options: HeadCosmeticOptions) {
    super(options.id);
    this._backImagePaths = options.backImagePaths;
    this._frontImagePaths = options.frontImagePaths;
  }

  public get backImagePaths(): Record<string, string | null> {
    return this._backImagePaths;
  }

  public get frontImagePaths(): Record<string, string | null> {
    return this._frontImagePaths;
  }
}
