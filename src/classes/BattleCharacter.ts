import { Battler } from "./Battler";
import { Class } from "./Class";
import { Definable, DefinableReference, getDefinable } from "definables";
import { Item } from "./Item";
import { Player } from "./Player";
import { SkinColor } from "./SkinColor";

export interface BattleCharacterMove {
  readonly actionDefinableReference: DefinableReference;
  readonly battlerID?: string;
}
export interface BattleCharacterOptions {
  readonly battlerID: string;
  readonly classID: string;
  readonly clothesDyeItemID?: string;
  readonly figureID: string;
  readonly hairDyeItemID?: string;
  readonly maskItemID?: string;
  readonly outfitItemID?: string;
  readonly playerID: string;
  readonly skinColorID: string;
}
export class BattleCharacter extends Definable {
  private readonly _battlerID: string;
  private readonly _classID: string;
  private readonly _clothesDyeItemID?: string;
  private readonly _figureID: string;
  private readonly _hairDyeItemID?: string;
  private readonly _maskItemID?: string;
  private readonly _outfitItemID?: string;
  private readonly _playerID: string;
  private readonly _skinColorID: string;
  private _submittedMove: BattleCharacterMove | null = null;
  public constructor(id: string, options: BattleCharacterOptions) {
    super(id);
    this._battlerID = options.battlerID;
    this._classID = options.classID;
    this._clothesDyeItemID = options.clothesDyeItemID;
    this._figureID = options.figureID;
    this._hairDyeItemID = options.hairDyeItemID;
    this._maskItemID = options.maskItemID;
    this._outfitItemID = options.outfitItemID;
    this._playerID = options.playerID;
    this._skinColorID = options.skinColorID;
  }

  public get battler(): Battler {
    return getDefinable(Battler, this._battlerID);
  }

  public get battlerID(): string {
    return this._battlerID;
  }

  public get class(): Class {
    return getDefinable(Class, this._classID);
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

  public get skinColor(): SkinColor {
    return getDefinable(SkinColor, this._skinColorID);
  }

  public get skinColorID(): string {
    return this._skinColorID;
  }

  public get submittedMove(): BattleCharacterMove {
    if (this._submittedMove !== null) {
      return this._submittedMove;
    }
    throw new Error(this.getAccessorErrorMessage("submittedMove"));
  }

  public set submittedMove(submittedMove: BattleCharacterMove | null) {
    this._submittedMove = submittedMove;
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

  public hasSubmittedMove(): boolean {
    return this._submittedMove !== null;
  }
}
