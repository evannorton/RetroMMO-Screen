import { Definable } from "definables";
import { PianoDefinition } from "retrommo-types";

export interface PianoOptions {
  readonly definition: PianoDefinition;
  readonly id: string;
}
export class Piano extends Definable {
  public constructor(options: PianoOptions) {
    super(options.id);
  }
}
