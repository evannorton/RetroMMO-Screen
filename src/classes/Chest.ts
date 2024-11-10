import { ChestDefinition } from "retrommo-types";
import { Definable } from "definables";

export interface ChestOptions {
  definition: ChestDefinition;
  id: string;
}
export class Chest extends Definable {
  private readonly _imagePath: string;
  public constructor(options: ChestOptions) {
    super(options.id);
    this._imagePath = options.definition.imageSourceID;
  }

  public get imagePath(): string {
    return this._imagePath;
  }
}
