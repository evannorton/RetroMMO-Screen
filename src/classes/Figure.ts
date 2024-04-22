import { Definable } from "../definables";
import { FigureDefinition } from "retrommo-types";

export interface FigureOptions {
  id: string;
  definition: FigureDefinition;
}
export class Figure extends Definable {
  public constructor(options: FigureOptions) {
    super(options.id);
  }
}
