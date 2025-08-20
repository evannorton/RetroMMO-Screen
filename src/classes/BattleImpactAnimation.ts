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
  public constructor(options: BattleImpactAnimationOptions) {
    super(options.id);
    this._alignment = options.definition.alignment;
    this._imagePath = options.definition.imagePath;
  }

  public get alignment(): BattleImpactAlignment {
    return this._alignment;
  }

  public get imagePath(): string {
    return this._imagePath;
  }
}
