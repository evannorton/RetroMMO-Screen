import { CombinationLockDefinition } from "retrommo-types";
import { Definable } from "definables";

export interface CombinationLockOptions {
  definition: CombinationLockDefinition;
  id: string;
}
export class CombinationLock extends Definable {
  private readonly _imageSourceID: string;
  public constructor(options: CombinationLockOptions) {
    super(options.id);
    this._imageSourceID = options.definition.imageSourceID;
  }

  public get imageSourceID(): string {
    return this._imageSourceID;
  }
}
