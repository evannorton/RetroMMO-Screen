import { Definable } from "definables";
import { MonsterDefinition } from "retrommo-types";

export interface MonsterOptions {
  readonly definition: MonsterDefinition;
  readonly id: string;
}
export class Monster extends Definable {
  public readonly _battleHeight: number;
  public readonly _battleWidth: number;
  public readonly _name: string;
  public constructor(options: MonsterOptions) {
    super(options.id);
    this._name = options.definition.name;
    this._battleHeight = options.definition.battleHeight;
    this._battleWidth = options.definition.battleWidth;
  }

  public get battleHeight(): number {
    return this._battleHeight;
  }

  public get battleWidth(): number {
    return this._battleWidth;
  }

  public get name(): string {
    return this._name;
  }
}
