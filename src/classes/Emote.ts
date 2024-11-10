import { Definable } from "definables";
import { EmoteDefinition } from "retrommo-types";

export interface EmoteOptions {
  id: string;
  definition: EmoteDefinition;
}
export class Emote extends Definable {
  private readonly _backgroundImagePath: string;
  private readonly _foregroundImagePath?: string;
  public constructor(options: EmoteOptions) {
    super(options.id);
    this._backgroundImagePath = options.definition.backgroundImageSourceID;
    this._foregroundImagePath = options.definition.foregroundImageSourceID;
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

  public hasForegroundImagePath(): boolean {
    return typeof this._foregroundImagePath !== "undefined";
  }
}
