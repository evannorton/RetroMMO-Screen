import { CombinationLockDefinition } from "retrommo-types";
import { Definable } from "definables";

export interface CombinationLockOptions {
  readonly definition: CombinationLockDefinition;
  readonly id: string;
}
export class CombinationLock extends Definable {
  private readonly _imagePath: string;
  public constructor(options: CombinationLockOptions) {
    super(options.id);
    this._imagePath = options.definition.imageSourceID;
  }

  public get imagePath(): string {
    return this._imagePath;
  }
}
