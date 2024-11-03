import { BankDefinition } from "retrommo-types";
import { Definable } from "definables";

export interface BankOptions {
  definition: BankDefinition;
  id: string;
}
export class Bank extends Definable {
  private readonly _imageSourceID: string;
  public constructor(options: BankOptions) {
    super(options.id);
    this._imageSourceID = options.definition.imageSourceID;
  }

  public get imageSourceID(): string {
    return this._imageSourceID;
  }
}
