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
  private readonly _imagePath: string;
  private readonly _name: string;
  private readonly _offset?: number;
  private readonly _shadowXOffset: number;
  private readonly _shadowXRadius: number;
  private readonly _shadowYOffset: number;
  private readonly _shadowYRadius: number;
  public constructor(options: MonsterOptions) {
    super(options.id);
    this._name = options.definition.name;
    this._battleHeight = options.definition.battleHeight;
    this._battleWidth = options.definition.battleWidth;
    this._deathAudioPath = options.definition.deathAudioPath;
    this._imagePath = options.definition.imagePath;
    this._offset = options.definition.offset;
    this._shadowXOffset = options.definition.shadowXOffset;
    this._shadowXRadius = options.definition.shadowXRadius;
    this._shadowYOffset = options.definition.shadowYOffset;
    this._shadowYRadius = options.definition.shadowYRadius;
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

  public get imagePath(): string {
    return this._imagePath;
  }

  public get name(): string {
    return this._name;
  }

  public get offset(): number {
    if (typeof this._offset !== "undefined") {
      return this._offset;
    }
    throw new Error(this.getAccessorErrorMessage("offset"));
  }

  public get shadowXOffset(): number {
    return this._shadowXOffset;
  }

  public get shadowXRadius(): number {
    return this._shadowXRadius;
  }

  public get shadowYOffset(): number {
    return this._shadowYOffset;
  }

  public get shadowYRadius(): number {
    return this._shadowYRadius;
  }

  public hasOffset(): boolean {
    return typeof this._offset !== "undefined";
  }
}
