import { Definable } from "definables";

export interface BattleCharacterOptionsResources {
  readonly hp: number;
  readonly maxHP: number;
  readonly maxMP?: number;
  readonly mp?: number;
}
export interface BattleCharacterOptions {
  readonly resources?: BattleCharacterOptionsResources;
}
export interface BattleCharacterResources {
  readonly hp: number;
  readonly maxHP: number;
  readonly maxMP: number | null;
  readonly mp: number | null;
}
export class BattleCharacter extends Definable {
  private readonly _resources: BattleCharacterResources | null;
  public constructor(id: string, options: BattleCharacterOptions) {
    super(id);
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

  public get resources(): BattleCharacterResources {
    if (this._resources !== null) {
      return this._resources;
    }
    throw new Error(this.getAccessorErrorMessage("resources"));
  }
}
