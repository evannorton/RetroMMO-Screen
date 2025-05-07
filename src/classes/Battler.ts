import { BattleCharacter } from "./BattleCharacter";
import { Definable, getDefinable } from "definables";

export interface BattlerResources {
  readonly hp: number;
  readonly maxHP: number;
  readonly maxMP: number | null;
  readonly mp: number | null;
}
export interface BattlerOptionsResources {
  readonly hp: number;
  readonly maxHP: number;
  readonly maxMP?: number;
  readonly mp?: number;
}
export interface BattlerOptions {
  readonly battleCharacterID?: string;
  readonly resources?: BattlerOptionsResources;
}
export class Battler extends Definable {
  private readonly _battleCharacterID?: string;
  private readonly _resources: BattlerResources | null;
  public constructor(id: string, options: BattlerOptions) {
    super(id);
    this._battleCharacterID = options.battleCharacterID;
    this._resources =
      typeof options.resources !== "undefined"
        ? {
            hp: options.resources.hp,
            maxHP: options.resources.maxHP,
            maxMP: options.resources.maxMP ?? null,
            mp: options.resources.mp ?? null,
          }
        : null;
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

  public get resources(): BattlerResources {
    if (this._resources !== null) {
      return this._resources;
    }
    throw new Error(this.getAccessorErrorMessage("resources"));
  }
}
