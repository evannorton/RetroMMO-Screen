import { BattleCharacter } from "./BattleCharacter";
import { BattlerType } from "retrommo-types";
import { Definable, getDefinable } from "definables";
import { Monster } from "./Monster";

export interface BattlerResources {
  hp: number;
  readonly maxHP: number;
  readonly maxMP: number | null;
  mp: number | null;
}
export interface BattlerOptionsResources {
  readonly hp: number;
  readonly maxHP: number;
  readonly maxMP?: number;
  readonly mp?: number;
}
export interface BattlerOptions {
  readonly battleCharacterID?: string;
  readonly isAlive?: boolean;
  readonly resources?: BattlerOptionsResources;
  readonly type: BattlerType;
}
export class Battler extends Definable {
  private readonly _battleCharacterID?: string;
  private _isAlive: boolean;
  private readonly _monsterID?: string;
  private _resources: BattlerResources | null;
  private readonly _type: BattlerType;
  public constructor(id: string, options: BattlerOptions) {
    super(id);
    this._battleCharacterID = options.battleCharacterID;
    this._isAlive = options.isAlive ?? false;
    this._resources =
      typeof options.resources !== "undefined"
        ? {
            hp: options.resources.hp,
            maxHP: options.resources.maxHP,
            maxMP: options.resources.maxMP ?? null,
            mp: options.resources.mp ?? null,
          }
        : null;
    this._type = options.type;
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

  public get isAlive(): boolean {
    return this._isAlive;
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

  public set resources(resources: BattlerResources) {
    this._resources = {
      hp: resources.hp,
      maxHP: resources.maxHP,
      maxMP: resources.maxMP,
      mp: resources.mp,
    };
  }

  public hasBattleCharacter(): boolean {
    return typeof this._battleCharacterID !== "undefined";
  }
}
