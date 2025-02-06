import { Class } from "./Class";
import { Definable, getDefinable } from "definables";
import { Figure } from "./Figure";
import { Item } from "./Item";
import { SkinColor } from "./SkinColor";

export interface MainMenuCharacterOptions {
  readonly classID: string;
  readonly clothesDyeItemID?: string;
  readonly figureID: string;
  readonly hairDyeItemID?: string;
  readonly id: string;
  readonly level: number;
  readonly maskItemID?: string;
  readonly outfitItemID?: string;
  readonly skinColorID: string;
}
export class MainMenuCharacter extends Definable {
  private readonly _classID: string;
  private readonly _clothesDyeItemID: string | null;
  private readonly _figureID: string;
  private readonly _hairDyeItemID: string | null;
  private readonly _level: number;
  private readonly _maskItemID: string | null;
  private readonly _outfitItemID: string | null;
  private readonly _skinColorID: string;
  public constructor(options: MainMenuCharacterOptions) {
    super(options.id);
    this._classID = options.classID;
    this._clothesDyeItemID = options.clothesDyeItemID ?? null;
    this._figureID = options.figureID;
    this._hairDyeItemID = options.hairDyeItemID ?? null;
    this._level = options.level;
    this._maskItemID = options.maskItemID ?? null;
    this._outfitItemID = options.outfitItemID ?? null;
    this._skinColorID = options.skinColorID;
  }

  public get class(): Class {
    return getDefinable(Class, this._classID);
  }

  public get clothesDyeItem(): Item {
    if (this._clothesDyeItemID !== null) {
      return getDefinable(Item, this._clothesDyeItemID);
    }
    throw new Error(this.getAccessorErrorMessage("clothesDyeItem"));
  }

  public get figure(): Figure {
    return getDefinable(Figure, this._figureID);
  }

  public get hairDyeItem(): Item {
    if (this._hairDyeItemID !== null) {
      return getDefinable(Item, this._hairDyeItemID);
    }
    throw new Error(this.getAccessorErrorMessage("hairDyeItem"));
  }

  public get level(): number {
    return this._level;
  }

  public get maskItem(): Item {
    if (this._maskItemID !== null) {
      return getDefinable(Item, this._maskItemID);
    }
    throw new Error(this.getAccessorErrorMessage("maskItem"));
  }

  public get outfitItem(): Item {
    if (this._outfitItemID !== null) {
      return getDefinable(Item, this._outfitItemID);
    }
    throw new Error(this.getAccessorErrorMessage("outfitItem"));
  }

  public get skinColor(): SkinColor {
    return getDefinable(SkinColor, this._skinColorID);
  }

  public hasClothesDyeItem(): boolean {
    return this._clothesDyeItemID !== null;
  }

  public hasHairDyeItem(): boolean {
    return this._hairDyeItemID !== null;
  }

  public hasMaskItem(): boolean {
    return this._maskItemID !== null;
  }

  public hasOutfitItem(): boolean {
    return this._outfitItemID !== null;
  }
}
