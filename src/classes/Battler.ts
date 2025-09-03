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
export interface BattlerPoison {
  readonly order: number;
}
export interface BattlerBleed {
  readonly order: number;
}
export interface BattlerOptionsPoison {
  readonly order: number;
}
export interface BattlerOptionsBleed {
  readonly order: number;
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
  readonly bleed?: BattlerOptionsBleed;
  readonly gold: number;
  readonly isAlive?: boolean;
  readonly poison?: BattlerOptionsPoison;
  readonly monsterID?: string;
  readonly resources?: BattlerOptionsResources;
  readonly type: BattlerType;
}
export class Battler extends Definable {
  private readonly _battleCharacterID?: string;
  private _bleed: BattlerBleed | null;
  private readonly _gold: number;
  private _isAlive: boolean;
  private readonly _monsterID?: string;
  private _poison: BattlerPoison | null;
  private _resources: BattlerResources | null;
  private readonly _type: BattlerType;
  public constructor(id: string, options: BattlerOptions) {
    super(id);
    this._battleCharacterID = options.battleCharacterID;
    this._gold = options.gold;
    this._isAlive = options.isAlive ?? false;
    this._bleed =
      typeof options.bleed !== "undefined"
        ? {
            order: options.bleed.order,
          }
        : null;
    this._poison =
      typeof options.poison !== "undefined"
        ? {
            order: options.poison.order,
          }
        : null;
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

  public get bleed(): BattlerBleed {
    if (this._bleed !== null) {
      return this._bleed;
    }
    throw new Error(this.getAccessorErrorMessage("bleed"));
  }

  public get gold(): number {
    return this._gold;
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

  public get poison(): BattlerPoison {
    if (this._poison !== null) {
      return this._poison;
    }
    throw new Error(this.getAccessorErrorMessage("poison"));
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

  public set bleed(bleed: BattlerBleed | null) {
    this._bleed = bleed;
  }

  public set isAlive(isAlive: boolean) {
    this._isAlive = isAlive;
  }

  public set poison(poison: BattlerPoison | null) {
    this._poison = poison;
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

  public hasBleed(): boolean {
    return this._bleed !== null;
  }

  public hasPoison(): boolean {
    return this._poison !== null;
  }
}
