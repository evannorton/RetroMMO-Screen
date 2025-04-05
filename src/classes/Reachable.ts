import { Definable, getDefinable } from "definables";
import { Landscape } from "./Landscape";
import { ReachableDefinition } from "retrommo-types";

export interface ReachableOptions {
  readonly definition: ReachableDefinition;
  readonly id: string;
}
export class Reachable extends Definable {
  private readonly _landscapeID: string;
  public constructor(options: ReachableOptions) {
    super(options.id);
    this._landscapeID = options.definition.landscapeID;
  }

  public get landscape(): Landscape {
    return getDefinable(Landscape, this._landscapeID);
  }

  public get landscapeID(): string {
    return this._landscapeID;
  }
}
