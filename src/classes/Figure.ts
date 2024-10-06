import { Definable } from "definables";
import { FigureDefinition } from "retrommo-types";

export interface FigureOptions {
  id: string;
  definition: FigureDefinition;
}
export class Figure extends Definable {
  private readonly _characterCustomizeOrder?: number;
  public constructor(options: FigureOptions) {
    super(options.id);
    this._characterCustomizeOrder = options.definition.characterCustomizeOrder;
  }

  public get characterCustomizeOrder(): number | undefined {
    return this._characterCustomizeOrder;
  }
}
