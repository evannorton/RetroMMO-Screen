import {
  BattleImpactAlignment,
  BattleImpactAnimationDefinition,
} from "retrommo-types";
import { Definable } from "definables";

export interface BattleImpactAnimationOptions {
  readonly definition: BattleImpactAnimationDefinition;
  readonly id: string;
}
export class BattleImpactAnimation extends Definable {
  private readonly _alignment: BattleImpactAlignment;
  private readonly _imagePath: string;
  private readonly _offset?: number;
  public constructor(options: BattleImpactAnimationOptions) {
    super(options.id);
    this._alignment = options.definition.alignment;
    this._imagePath = options.definition.imagePath;
    this._offset = options.definition.offset;
  }

  public get alignment(): BattleImpactAlignment {
    return this._alignment;
  }

  public get imagePath(): string {
    return this._imagePath;
  }

  public get offset(): number {
    if (typeof this._offset !== "undefined") {
      return this._offset;
    }
    throw new Error(this.getAccessorErrorMessage("offset"));
  }

  public hasOffset(): boolean {
    return typeof this._offset !== "undefined";
  }
}
