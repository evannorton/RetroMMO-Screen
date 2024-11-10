import { BankDefinition } from "retrommo-types";
import { Definable } from "definables";

export interface BankOptions {
  definition: BankDefinition;
  id: string;
}
export class Bank extends Definable {
  private readonly _imagePath: string;
  public constructor(options: BankOptions) {
    super(options.id);
    this._imagePath = options.definition.imageSourceID;
  }

  public get imagePath(): string {
    return this._imagePath;
  }
}
