import { Definable } from "definables";
import { MusicTrackDefinition } from "retrommo-types";

export interface MusicTrackOptions {
  readonly definition: MusicTrackDefinition;
  readonly id: string;
}
export class MusicTrack extends Definable {
  private readonly _audioPath: string;
  private readonly _loopPoint?: number;
  public constructor(options: MusicTrackOptions) {
    super(options.id);
    this._audioPath = options.definition.audioPath;
    this._loopPoint = options.definition.loopPoint;
  }

  public get audioPath(): string {
    return this._audioPath;
  }

  public get loopPoint(): number {
    if (typeof this._loopPoint !== "undefined") {
      return this._loopPoint;
    }
    throw new Error(this.getAccessorErrorMessage("loopPoint"));
  }

  public hasLoopPoint(): boolean {
    return typeof this._loopPoint !== "undefined";
  }
}
