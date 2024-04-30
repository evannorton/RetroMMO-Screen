import { Class } from "./Class";
import { ClothesDye } from "./ClothesDye";
import { Definable, getDefinable, getDefinables } from "../definables";
import { Figure } from "./Figure";
import { HairDye } from "./HairDye";
import { ItemInstance } from "./ItemInstance";
import { Mask } from "./Mask";
import { Outfit } from "./Outfit";
import { SkinColor } from "./SkinColor";

export interface CharacterOptions {
  classID: string;
  clothesDyeItemInstanceID: string | null;
  figureID: string;
  hairDyeItemInstanceID: string | null;
  id: string;
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
    super(options.id);
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

  public get figure(): Figure {
    return getDefinable(Figure, this._figureID);
  }

  public get level(): number {
    return this._level;
  }

  public get skinColor(): SkinColor {
    return getDefinable(SkinColor, this._skinColorID);
  }

  private get clothesDyeItemInstance(): ItemInstance {
    if (this._clothesDyeItemInstanceID !== null) {
      return getDefinable(ItemInstance, this._clothesDyeItemInstanceID);
    }
    throw new Error(this.getAccessorErrorMessage("clothesDyeItemInstance"));
  }

  private get hairDyeItemInstance(): ItemInstance {
    if (this._hairDyeItemInstanceID !== null) {
      return getDefinable(ItemInstance, this._hairDyeItemInstanceID);
    }
    throw new Error(this.getAccessorErrorMessage("hairDyeItemInstance"));
  }

  private get maskItemInstance(): ItemInstance {
    if (this._maskItemInstanceID !== null) {
      return getDefinable(ItemInstance, this._maskItemInstanceID);
    }
    throw new Error(this.getAccessorErrorMessage("maskItemInstance"));
  }

  private get outfitItemInstance(): ItemInstance {
    if (this._outfitItemInstanceID !== null) {
      return getDefinable(ItemInstance, this._outfitItemInstanceID);
    }
    throw new Error(this.getAccessorErrorMessage("outfitItemInstance"));
  }

  public getClothesDye(): ClothesDye {
    if (this.hasClothesDyeItemInstance()) {
      return this.clothesDyeItemInstance.item.clothesDye;
    }
    const defaultClothesDye: [string, ClothesDye] | undefined = Array.from(
      getDefinables(ClothesDye),
    ).find(
      (clothesDye: [string, ClothesDye]): boolean => clothesDye[1].isDefault,
    );
    if (typeof defaultClothesDye === "undefined") {
      throw new Error("Default clothes dye is undefined");
    }
    return defaultClothesDye[1];
  }

  public getHairDye(): HairDye {
    if (this.hasHairDyeItemInstance()) {
      return this.hairDyeItemInstance.item.hairDye;
    }
    const defaultHairDye: [string, HairDye] | undefined = Array.from(
      getDefinables(HairDye),
    ).find((hairDye: [string, HairDye]): boolean => hairDye[1].isDefault);
    if (typeof defaultHairDye === "undefined") {
      throw new Error("Default hair dye is undefined");
    }
    return defaultHairDye[1];
  }

  public getMask(): Mask {
    if (this.hasMaskItemInstance()) {
      return this.maskItemInstance.item.mask;
    }
    const defaultMask: [string, Mask] | undefined = Array.from(
      getDefinables(Mask),
    ).find((mask: [string, Mask]): boolean => mask[1].isDefault);
    if (typeof defaultMask === "undefined") {
      throw new Error("Default mask is undefined");
    }
    return defaultMask[1];
  }

  public getOutfit(): Outfit {
    if (this.hasOutfitItemInstance()) {
      return this.outfitItemInstance.item.outfit;
    }
    const defaultOutfit: [string, Outfit] | undefined = Array.from(
      getDefinables(Outfit),
    ).find((outfit: [string, Outfit]): boolean => outfit[1].isDefault);
    if (typeof defaultOutfit === "undefined") {
      throw new Error("Default mask is undefined");
    }
    return defaultOutfit[1];
  }

  private hasClothesDyeItemInstance(): boolean {
    return this._clothesDyeItemInstanceID !== null;
  }

  private hasHairDyeItemInstance(): boolean {
    return this._hairDyeItemInstanceID !== null;
  }

  private hasMaskItemInstance(): boolean {
    return this._maskItemInstanceID !== null;
  }

  private hasOutfitItemInstance(): boolean {
    return this._outfitItemInstanceID !== null;
  }
}
