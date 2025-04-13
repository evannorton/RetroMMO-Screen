import { Definable, getDefinable } from "definables";
import { Item } from "./Item";
import { Player } from "./Player";
import { SkinColor } from "./SkinColor";

export interface BattleCharacterOptionsResources {
  readonly hp: number;
  readonly maxHP: number;
  readonly maxMP?: number;
  readonly mp?: number;
}
export interface BattleCharacterOptions {
  readonly clothesDyeItemID?: string;
  readonly figureID: string;
  readonly hairDyeItemID?: string;
  readonly maskItemID?: string;
  readonly outfitItemID?: string;
  readonly playerID: string;
  readonly resources?: BattleCharacterOptionsResources;
  readonly skinColorID: string;
}
export interface BattleCharacterResources {
  readonly hp: number;
  readonly maxHP: number;
  readonly maxMP: number | null;
  readonly mp: number | null;
}
export class BattleCharacter extends Definable {
  private readonly _clothesDyeItemID?: string;
  private readonly _figureID: string;
  private readonly _hairDyeItemID?: string;
  private readonly _maskItemID?: string;
  private readonly _outfitItemID?: string;
  private readonly _playerID: string;
  private readonly _resources: BattleCharacterResources | null;
  private readonly _skinColorID: string;
  public constructor(id: string, options: BattleCharacterOptions) {
    super(id);
    this._clothesDyeItemID = options.clothesDyeItemID;
    this._figureID = options.figureID;
    this._hairDyeItemID = options.hairDyeItemID;
    this._maskItemID = options.maskItemID;
    this._outfitItemID = options.outfitItemID;
    this._playerID = options.playerID;
    this._resources =
      typeof options.resources !== "undefined"
        ? {
            hp: options.resources.hp,
            maxHP: options.resources.maxHP,
            maxMP: options.resources.maxMP ?? null,
            mp: options.resources.mp ?? null,
          }
        : null;
    this._skinColorID = options.skinColorID;
  }

  public get clothesDyeItem(): Item {
    if (typeof this._clothesDyeItemID !== "undefined") {
      return getDefinable(Item, this._clothesDyeItemID);
    }
    throw new Error(this.getAccessorErrorMessage("clothesDyeItem"));
  }

  public get clothesDyeItemID(): string {
    if (typeof this._clothesDyeItemID !== "undefined") {
      return this._clothesDyeItemID;
    }
    throw new Error(this.getAccessorErrorMessage("clothesDyeItemID"));
  }

  public get figure(): string {
    return this._figureID;
  }

  public get figureID(): string {
    return this._figureID;
  }

  public get hairDyeItem(): Item {
    if (typeof this._hairDyeItemID !== "undefined") {
      return getDefinable(Item, this._hairDyeItemID);
    }
    throw new Error(this.getAccessorErrorMessage("hairDyeItem"));
  }

  public get hairDyeItemID(): string {
    if (typeof this._hairDyeItemID !== "undefined") {
      return this._hairDyeItemID;
    }
    throw new Error(this.getAccessorErrorMessage("hairDyeItemID"));
  }

  public get maskItem(): Item {
    if (typeof this._maskItemID !== "undefined") {
      return getDefinable(Item, this._maskItemID);
    }
    throw new Error(this.getAccessorErrorMessage("maskItem"));
  }

  public get maskItemID(): string {
    if (typeof this._maskItemID !== "undefined") {
      return this._maskItemID;
    }
    throw new Error(this.getAccessorErrorMessage("maskItemID"));
  }

  public get outfitItem(): Item {
    if (typeof this._outfitItemID !== "undefined") {
      return getDefinable(Item, this._outfitItemID);
    }
    throw new Error(this.getAccessorErrorMessage("outfitItem"));
  }

  public get outfitItemID(): string {
    if (typeof this._outfitItemID !== "undefined") {
      return this._outfitItemID;
    }
    throw new Error(this.getAccessorErrorMessage("outfitItemID"));
  }

  public get player(): Player {
    return getDefinable(Player, this._playerID);
  }

  public get playerID(): string {
    return this._playerID;
  }

  public get resources(): BattleCharacterResources {
    if (this._resources !== null) {
      return this._resources;
    }
    throw new Error(this.getAccessorErrorMessage("resources"));
  }

  public get skinColor(): SkinColor {
    return getDefinable(SkinColor, this._skinColorID);
  }

  public get skinColorID(): string {
    return this._skinColorID;
  }

  public hasClothesDyeItem(): boolean {
    return typeof this._clothesDyeItemID !== "undefined";
  }

  public hasHairDyeItem(): boolean {
    return typeof this._hairDyeItemID !== "undefined";
  }

  public hasMaskItem(): boolean {
    return typeof this._maskItemID !== "undefined";
  }

  public hasOutfitItem(): boolean {
    return typeof this._outfitItemID !== "undefined";
  }
}
