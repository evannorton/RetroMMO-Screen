import { Definable } from "definables";
import { TransportDefinition } from "retrommo-types";

export interface TransportOptions {
  readonly definition: TransportDefinition;
  readonly id: string;
}
export class Transport extends Definable {
  private readonly _audioPath?: string;
  public constructor(options: TransportOptions) {
    super(options.id);
    this._audioPath = options.definition.audioPath;
  }

  public get audioPath(): string {
    if (typeof this._audioPath !== "undefined") {
      return this._audioPath;
    }
    throw new Error(this.getAccessorErrorMessage("audioPath"));
  }

  public hasAudioPath(): boolean {
    return typeof this._audioPath !== "undefined";
  }
}
