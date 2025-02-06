import { ChestDefinition } from "retrommo-types";
import { Definable } from "definables";

export interface ChestOptions {
  readonly definition: ChestDefinition;
  readonly id: string;
}
export class Chest extends Definable {
  private readonly _imagePath: string;
  private _openedAt: number | null = null;
  public constructor(options: ChestOptions) {
    super(options.id);
    this._imagePath = options.definition.imageSourceID;
  }

  public get imagePath(): string {
    return this._imagePath;
  }

  public get openedAt(): number {
    if (this._openedAt !== null) {
      return this._openedAt;
    }
    throw new Error(this.getAccessorErrorMessage("openedAt"));
  }

  public set openedAt(openedAt: number | null) {
    if (this._openedAt === null) {
      this._openedAt = openedAt;
    }
  }

  public hasOpenedAt(): boolean {
    return this._openedAt !== null;
  }
}
