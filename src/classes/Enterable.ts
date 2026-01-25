import { Definable } from "definables";
import { EnterableDefinition } from "retrommo-types";

export interface EnterableOptions {
  readonly definition: EnterableDefinition;
  readonly id: string;
}
export class Enterable extends Definable {
  private readonly _audioPath: string;
  public constructor(options: EnterableOptions) {
    super(options.id);
    this._audioPath = options.definition.audioPath;
  }

  public get audioPath(): string {
    return this._audioPath;
  }
}
