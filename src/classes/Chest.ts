import { ChestDefinition } from "retrommo-types";
import { Definable } from "definables";

export interface ChestOptions {
  definition: ChestDefinition;
  id: string;
}
export class Chest extends Definable {
  private readonly _imageSourceID: string;
  public constructor(options: ChestOptions) {
    super(options.id);
    this._imageSourceID = options.definition.imageSourceID;
  }

  public get imageSourceID(): string {
    return this._imageSourceID;
  }
}
