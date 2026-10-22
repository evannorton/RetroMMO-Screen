import { Definable } from "definables";
import { MonsterDefinition } from "retrommo-types";

export interface MonsterOptions {
  readonly definition: MonsterDefinition;
  readonly id: string;
}
export class Monster extends Definable {
  private readonly _agility: number;
  private readonly _battleHeight: number;
  private readonly _battleWidth: number;
  private readonly _countsTowardTotal: boolean;
  private readonly _deathAudioPath: string;
  private readonly _defense: number;
  private readonly _experience: number;
  private readonly _gold: number;
  private readonly _imagePath: string;
  private readonly _intelligence: number;
  private readonly _level: number;
  private readonly _luck: number;
  private readonly _maxHP: number;
  private readonly _maxMP: number;
  private readonly _name: string;
  private readonly _offset?: number;
  private readonly _shadowXOffset: number;
  private readonly _shadowXRadius: number;
  private readonly _shadowYOffset: number;
  private readonly _shadowYRadius: number;
  private readonly _strength: number;
  private readonly _wisdom: number;
  public constructor(options: MonsterOptions) {
    super(options.id);
    this._agility = options.definition.agility;
    this._name = options.definition.name;
    this._battleHeight = options.definition.battleHeight;
    this._battleWidth = options.definition.battleWidth;
    this._countsTowardTotal = options.definition.countsTowardTotal ?? false;
    this._deathAudioPath = options.definition.deathAudioPath;
    this._defense = options.definition.defense;
    this._experience = options.definition.experience;
    this._gold = options.definition.gold;
    this._imagePath = options.definition.imagePath;
    this._intelligence = options.definition.intelligence;
    this._level = options.definition.level;
    this._luck = options.definition.luck;
    this._maxHP = options.definition.maxHP;
    this._maxMP = options.definition.maxMP;
    this._offset = options.definition.offset;
    this._shadowXOffset = options.definition.shadowXOffset;
    this._shadowXRadius = options.definition.shadowXRadius;
    this._shadowYOffset = options.definition.shadowYOffset;
    this._shadowYRadius = options.definition.shadowYRadius;
    this._strength = options.definition.strength;
    this._wisdom = options.definition.wisdom;
  }

  public get agility(): number {
    return this._agility;
  }

  public get battleHeight(): number {
    return this._battleHeight;
  }

  public get battleWidth(): number {
    return this._battleWidth;
  }

  public get countsTowardTotal(): boolean {
    return this._countsTowardTotal;
  }

  public get deathAudioPath(): string {
    return this._deathAudioPath;
  }

  public get defense(): number {
    return this._defense;
  }

  public get experience(): number {
    return this._experience;
  }

  public get gold(): number {
    return this._gold;
  }

  public get imagePath(): string {
    return this._imagePath;
  }

  public get intelligence(): number {
    return this._intelligence;
  }

  public get level(): number {
    return this._level;
  }

  public get luck(): number {
    return this._luck;
  }

  public get maxHP(): number {
    return this._maxHP;
  }

  public get maxMP(): number {
    return this._maxMP;
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

  public get strength(): number {
    return this._strength;
  }

  public get wisdom(): number {
    return this._wisdom;
  }

  public hasOffset(): boolean {
    return typeof this._offset !== "undefined";
  }
}
