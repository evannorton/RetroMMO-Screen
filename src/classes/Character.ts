import { Class } from "./Class";
import { Definable, getDefinable } from "../definables";
import { Figure } from "./Figure";
import { Item } from "./Item";
import { ItemInstance } from "./ItemInstance";
import { SkinColor } from "./SkinColor";
import {
  defaultClothesDyeItemID,
  defaultHairDyeItemID,
  defaultMaskItemID,
  defaultOutfitItemID,
} from "../constants/defaultVanities";

export interface CharacterOptions {
  classID: string;
  clothesDyeItemInstanceID: string | null;
  figureID: string;
  hairDyeItemInstanceID: string | null;
  level: number;
  maskItemInstanceID: string | null;
  outfitItemInstanceID: string | null;
  skinColorID: string;
}
export class Character extends Definable {
  private readonly _classID: string;
  private readonly _clothesDyeItemInstanceID: string | null;
  private readonly _figureID: string;
  private readonly _hairDyeItemInstanceID: string | null;
  private readonly _level: number;
  private readonly _maskItemInstanceID: string | null;
  private readonly _outfitItemInstanceID: string | null;
  private readonly _skinColorID: string;

  public constructor(options: CharacterOptions) {
    super();
    this._classID = options.classID;
    this._clothesDyeItemInstanceID = options.clothesDyeItemInstanceID;
    this._figureID = options.figureID;
    this._hairDyeItemInstanceID = options.hairDyeItemInstanceID;
    this._level = options.level;
    this._maskItemInstanceID = options.maskItemInstanceID;
    this._outfitItemInstanceID = options.outfitItemInstanceID;
    this._skinColorID = options.skinColorID;
  }

  public get class(): Class {
    return getDefinable(Class, this._classID);
  }

  public get clothesDyeItem(): Item {
    if (this.clothesDyeItemInstance !== null) {
      return this.clothesDyeItemInstance.item;
    }
    return getDefinable(Item, defaultClothesDyeItemID);
  }

  public get figure(): Figure {
    return getDefinable(Figure, this._figureID);
  }

  public get hairDyeItem(): Item {
    if (this.hairDyeItemInstance !== null) {
      return this.hairDyeItemInstance.item;
    }
    return getDefinable(Item, defaultHairDyeItemID);
  }

  public get level(): number {
    return this._level;
  }

  public get maskItem(): Item {
    if (this.maskItemInstance !== null) {
      return this.maskItemInstance.item;
    }
    return getDefinable(Item, defaultMaskItemID);
  }

  public get outfitItem(): Item {
    if (this.outfitItemInstance !== null) {
      return this.outfitItemInstance.item;
    }
    return getDefinable(Item, defaultOutfitItemID);
  }

  private get clothesDyeItemInstance(): ItemInstance | null {
    if (this._clothesDyeItemInstanceID !== null) {
      return getDefinable(ItemInstance, this._clothesDyeItemInstanceID);
    }
    return null;
  }

  private get hairDyeItemInstance(): ItemInstance | null {
    if (this._hairDyeItemInstanceID !== null) {
      return getDefinable(ItemInstance, this._hairDyeItemInstanceID);
    }
    return null;
  }

  private get maskItemInstance(): ItemInstance | null {
    if (this._maskItemInstanceID !== null) {
      return getDefinable(ItemInstance, this._maskItemInstanceID);
    }
    return null;
  }

  private get outfitItemInstance(): ItemInstance | null {
    if (this._outfitItemInstanceID !== null) {
      return getDefinable(ItemInstance, this._outfitItemInstanceID);
    }
    return null;
  }

  public get skinColor(): SkinColor {
    return getDefinable(SkinColor, this._skinColorID);
  }
}
