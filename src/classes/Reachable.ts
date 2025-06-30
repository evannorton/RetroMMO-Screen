import { Definable, getDefinable } from "definables";
import { Landscape } from "./Landscape";
import { MusicTrack } from "./MusicTrack";
import { ReachableDefinition } from "retrommo-types";

export interface ReachableOptions {
  readonly definition: ReachableDefinition;
  readonly id: string;
}
export class Reachable extends Definable {
  private readonly _landscapeID: string;
  private readonly _pveMusicTrackID: string;
  public constructor(options: ReachableOptions) {
    super(options.id);
    this._landscapeID = options.definition.landscapeID;
    this._pveMusicTrackID = options.definition.pveMusicTrackID;
  }

  public get landscape(): Landscape {
    return getDefinable(Landscape, this._landscapeID);
  }

  public get landscapeID(): string {
    return this._landscapeID;
  }

  public get pveMusicTrack(): MusicTrack {
    return getDefinable(MusicTrack, this._pveMusicTrackID);
  }

  public get pveMusicTrackID(): string {
    return this._pveMusicTrackID;
  }
}
