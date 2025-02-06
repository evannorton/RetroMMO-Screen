import { Color, SkinColorDefinition } from "retrommo-types";
import { Definable } from "definables";

export interface SkinColorOptions {
  readonly definition: SkinColorDefinition;
  readonly id: string;
}
export class SkinColor extends Definable {
  private readonly _characterCustomizeOrder?: number;
  private readonly _color1: Color;
  private readonly _color2: Color;
  public constructor(options: SkinColorOptions) {
    super(options.id);
    this._characterCustomizeOrder = options.definition.characterCustomizeOrder;
    this._color1 = options.definition.color1;
    this._color2 = options.definition.color2;
  }

  public get characterCustomizeOrder(): number | undefined {
    return this._characterCustomizeOrder;
  }

  public get color1(): Color {
    return this._color1;
  }

  public get color2(): Color {
    return this._color2;
  }
}
