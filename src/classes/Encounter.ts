import { Definable, getDefinable } from "definables";
import { EncounterDefinition } from "retrommo-types";
import { MusicTrack } from "./MusicTrack";

export interface EncounterOptions {
  readonly definition: EncounterDefinition;
  readonly id: string;
}
export class Encounter extends Definable {
  private readonly _victoryMusicTrackID?: string;
  public constructor(options: EncounterOptions) {
    super(options.id);
    this._victoryMusicTrackID = options.definition.victoryMusicTrackID;
  }

  public get victoryMusicTrack(): MusicTrack {
    if (typeof this._victoryMusicTrackID !== "undefined") {
      return getDefinable(MusicTrack, this._victoryMusicTrackID);
    }
    throw new Error(this.getAccessorErrorMessage("victoryMusicTrack"));
  }

  public get victoryMusicTrackID(): string {
    if (typeof this._victoryMusicTrackID !== "undefined") {
      return this._victoryMusicTrackID;
    }
    throw new Error(this.getAccessorErrorMessage("victoryMusicTrackID"));
  }

  public hasVictoryMusicTrack(): boolean {
    return typeof this._victoryMusicTrackID !== "undefined";
  }
}
