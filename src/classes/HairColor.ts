import { Color, HairColorDefinition } from "retrommo-types";
import { Definable } from "definables";

export interface HairColorOptions {
  readonly definition: HairColorDefinition;
  readonly id: string;
}
export class HairColor extends Definable {
  private readonly _color1: Color;
  private readonly _color2: Color;
  private readonly _color3: Color;
  public constructor(options: HairColorOptions) {
    super(options.id);
    this._color1 = options.definition.color1;
    this._color2 = options.definition.color2;
    this._color3 = options.definition.color3;
  }

  public get color1(): Color {
    return this._color1;
  }

  public get color2(): Color {
    return this._color2;
  }

  public get color3(): Color {
    return this._color3;
  }
}
