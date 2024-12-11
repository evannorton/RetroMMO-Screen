import { Definable } from "definables";
import { MonsterDefinition } from "retrommo-types";

export interface MonsterOptions {
  definition: MonsterDefinition;
  id: string;
}
export class Monster extends Definable {
  public readonly _name: string;
  public constructor(options: MonsterOptions) {
    super(options.id);
    this._name = options.definition.name;
  }

  public get name(): string {
    return this._name;
  }
}
