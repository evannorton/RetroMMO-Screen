import { Definable } from "definables";
import { MonsterDefinition } from "retrommo-types";

export interface MonsterOptions {
  readonly definition: MonsterDefinition;
  readonly id: string;
}
export class Monster extends Definable {
  private readonly _battleHeight: number;
  private readonly _battleWidth: number;
  private readonly _deathAudioPath: string;
  private readonly _name: string;
  public constructor(options: MonsterOptions) {
    super(options.id);
    this._name = options.definition.name;
    this._battleHeight = options.definition.battleHeight;
    this._battleWidth = options.definition.battleWidth;
    this._deathAudioPath = options.definition.deathAudioPath;
  }

  public get battleHeight(): number {
    return this._battleHeight;
  }

  public get battleWidth(): number {
    return this._battleWidth;
  }

  public get deathAudioPath(): string {
    return this._deathAudioPath;
  }

  public get name(): string {
    return this._name;
  }
}
