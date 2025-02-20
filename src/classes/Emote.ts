import { Definable } from "definables";
import { EmoteDefinition } from "retrommo-types";

export interface EmoteOptions {
  readonly definition: EmoteDefinition;
  readonly id: string;
}
export class Emote extends Definable {
  private readonly _backgroundImagePath: string;
  private readonly _foregroundImagePath?: string;
  private readonly _order: number;
  private readonly _requiresSubscription: boolean;
  public constructor(options: EmoteOptions) {
    super(options.id);
    this._backgroundImagePath = options.definition.backgroundImagePath;
    this._foregroundImagePath = options.definition.foregroundImagePath;
    this._order = options.definition.order;
    this._requiresSubscription =
      options.definition.requiresSubscription ?? false;
  }

  public get backgroundImagePath(): string {
    return this._backgroundImagePath;
  }

  public get foregroundImagePath(): string {
    if (typeof this._foregroundImagePath !== "undefined") {
      return this._foregroundImagePath;
    }
    throw new Error(this.getAccessorErrorMessage("foregroundImagePath"));
  }

  public get order(): number {
    return this._order;
  }

  public get requiresSubscription(): boolean {
    return this._requiresSubscription;
  }

  public hasForegroundImagePath(): boolean {
    return typeof this._foregroundImagePath !== "undefined";
  }
}
