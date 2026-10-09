import { AchievementDefinition } from "retrommo-types";
import { Definable } from "definables";

export interface AchievementOptions {
  readonly definition: AchievementDefinition;
  readonly id: string;
}
export class Achievement extends Definable {
  private readonly _description: string;
  private readonly _imagePath: string;
  private readonly _name: string;
  private _unlockedAtServerTime: number | null = null;

  public constructor(options: AchievementOptions) {
    super(options.id);
    this._description = options.definition.description;
    this._imagePath = options.definition.imagePath;
    this._name = options.definition.name;
  }

  public get description(): string {
    return this._description;
  }

  public get imagePath(): string {
    return this._imagePath;
  }

  public get name(): string {
    return this._name;
  }

  public get unlockedAtServerTime(): number {
    if (this._unlockedAtServerTime !== null) {
      return this._unlockedAtServerTime;
    }
    throw new Error(this.getAccessorErrorMessage("unlockedAtServerTime"));
  }

  public set unlockedAtServerTime(unlockedAtServerTime: number) {
    this._unlockedAtServerTime = unlockedAtServerTime;
  }

  public hasUnlockedAtServerTime(): boolean {
    return this._unlockedAtServerTime !== null;
  }
}
