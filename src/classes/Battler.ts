import { BattleCharacter } from "./BattleCharacter";
import { BattlerType } from "retrommo-types";
import { Definable, getDefinable } from "definables";
import { Monster } from "./Monster";

export interface BattlerResources {
  hp: number;
  readonly maxHP: number;
  readonly maxMP: number | null;
  mp: number | null;
  will: number | null;
}
export interface BattlerOptionsResources {
  readonly hp: number;
  readonly maxHP: number;
  readonly maxMP?: number;
  readonly mp?: number;
  readonly will?: number;
}
export interface BattlerOptions {
  readonly battleCharacterID?: string;
  readonly gold: number;
  readonly isAlive?: boolean;
  readonly isBleeding?: boolean;
  readonly monsterID?: string;
  readonly resources?: BattlerOptionsResources;
  readonly type: BattlerType;
}
export class Battler extends Definable {
  private readonly _battleCharacterID?: string;
  private readonly _gold: number;
  private _isAlive: boolean;
  private _isBleeding: boolean;
  private readonly _monsterID?: string;
  private _resources: BattlerResources | null;
  private readonly _type: BattlerType;
  public constructor(id: string, options: BattlerOptions) {
    super(id);
    this._battleCharacterID = options.battleCharacterID;
    this._gold = options.gold;
    this._isAlive = options.isAlive ?? false;
    this._isBleeding = options.isBleeding ?? false;
    this._resources =
      typeof options.resources !== "undefined"
        ? {
            hp: options.resources.hp,
            maxHP: options.resources.maxHP,
            maxMP: options.resources.maxMP ?? null,
            mp: options.resources.mp ?? null,
            will: options.resources.will ?? null,
          }
        : null;
    this._monsterID = options.monsterID;
    this._type = options.type;
    switch (options.type) {
      case BattlerType.Player:
        if (typeof this._battleCharacterID === "undefined") {
          throw new Error("Player must have a battleCharacterID");
        }
        break;
      case BattlerType.Monster:
        if (typeof this._monsterID === "undefined") {
          throw new Error("Monster must have a monsterID");
        }
        break;
    }
  }

  public get battleCharacter(): BattleCharacter {
    if (typeof this._battleCharacterID !== "undefined") {
      return getDefinable(BattleCharacter, this._battleCharacterID);
    }
    throw new Error(this.getAccessorErrorMessage("battleCharacter"));
  }

  public get battleCharacterID(): string {
    if (typeof this._battleCharacterID !== "undefined") {
      return this._battleCharacterID;
    }
    throw new Error(this.getAccessorErrorMessage("battleCharacterID"));
  }

  public get gold(): number {
    return this._gold;
  }

  public get isAlive(): boolean {
    return this._isAlive;
  }

  public get isBleeding(): boolean {
    return this._isBleeding;
  }

  public get monster(): Monster {
    if (typeof this._monsterID !== "undefined") {
      return getDefinable(Monster, this._monsterID);
    }
    throw new Error(this.getAccessorErrorMessage("monster"));
  }

  public get monsterID(): string {
    if (typeof this._monsterID !== "undefined") {
      return this._monsterID;
    }
    throw new Error(this.getAccessorErrorMessage("monsterID"));
  }

  public get resources(): BattlerResources {
    if (this._resources !== null) {
      return this._resources;
    }
    throw new Error(this.getAccessorErrorMessage("resources"));
  }

  public get type(): BattlerType {
    return this._type;
  }

  public set isAlive(isAlive: boolean) {
    this._isAlive = isAlive;
  }

  public set isBleeding(isBleeding: boolean) {
    this._isBleeding = isBleeding;
  }

  public set resources(resources: BattlerResources) {
    this._resources = {
      hp: resources.hp,
      maxHP: resources.maxHP,
      maxMP: resources.maxMP,
      mp: resources.mp,
      will: resources.will,
    };
  }

  public hasBattleCharacter(): boolean {
    return typeof this._battleCharacterID !== "undefined";
  }
}
