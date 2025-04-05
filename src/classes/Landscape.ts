import { Color, LandscapeDefinition } from "retrommo-types";
import { Definable } from "definables";

export interface LandscapeOptions {
  readonly definition: LandscapeDefinition;
  readonly id: string;
}
export class Landscape extends Definable {
  private readonly _imagePath: string;
  private readonly _shadowColor: Color;
  public constructor(options: LandscapeOptions) {
    super(options.id);
    this._imagePath = options.definition.imagePath;
    this._shadowColor = options.definition.shadowColor;
  }

  public get imagePath(): string {
    return this._imagePath;
  }

  public get shadowColor(): Color {
    return this._shadowColor;
  }
}
