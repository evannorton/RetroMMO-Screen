import { Class } from "./Class";
import { ClothesDye } from "./ClothesDye";
import { Definable, getDefinable } from "../definables";
import { Figure } from "./Figure";
import { HairDye } from "./HairDye";
import { ItemInstance } from "./ItemInstance";
import { Mask } from "./Mask";
import { Outfit } from "./Outfit";
import { SkinColor } from "./SkinColor";
import {
  createEntity,
  createQuadrilateral,
  goToLevel,
  lockCameraToEntity,
  removeEntity,
} from "pixel-pigeon";
import { getConstants } from "../functions/getConstants";
import { state } from "../state";

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
  tilemapID: string;
  userID: number;
  username: string;
  x: number;
  y: number;
}
export class Character extends Definable {
  private readonly _classID: string;
  private readonly _clothesDyeItemInstanceID: string | null;
  private _entityID: string | null = null;
  private readonly _figureID: string;
  private readonly _hairDyeItemInstanceID: string | null;
  private readonly _level: number;
  private readonly _maskItemInstanceID: string | null;
  private readonly _outfitItemInstanceID: string | null;
  private readonly _skinColorID: string;
  private readonly _tilemapID: string;
  private readonly _userID: number;
  private readonly _username: string;
  private readonly _x: number;
  private readonly _y: number;

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
    this._tilemapID = options.tilemapID;
    this._userID = options.userID;
    this._username = options.username;
    this._x = options.x;
    this._y = options.y;
    console.log(this._username);
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

  public addToWorld(): void {
    const tileSize: number = getConstants()["tile-size"];
    this._entityID = createEntity({
      height: tileSize,
      layerID: "characters",
      levelID: this._tilemapID,
      position: {
        x: this._x * tileSize,
        y: this._y * tileSize,
      },
      quadrilaterals: [
        {
          quadrilateralID: createQuadrilateral({
            color: "#ffffff",
            height: tileSize,
            width: tileSize,
          }),
        },
      ],
      width: tileSize,
    });
  }

  public belongsToPlayer(): boolean {
    return this._userID === state.values.userID;
  }

  public getClothesDye(): ClothesDye {
    if (this.hasClothesDyeItemInstance()) {
      return this.clothesDyeItemInstance.item.clothesDye;
    }
    if (state.values.defaultClothesDyeID === null) {
      throw new Error("Default clothes dye is null");
    }
    return getDefinable(ClothesDye, state.values.defaultClothesDyeID);
  }

  public getHairDye(): HairDye {
    if (this.hasHairDyeItemInstance()) {
      return this.hairDyeItemInstance.item.hairDye;
    }
    if (state.values.defaultHairDyeID === null) {
      throw new Error("Default hair dye is null");
    }
    return getDefinable(HairDye, state.values.defaultHairDyeID);
  }

  public getMask(): Mask {
    if (this.hasMaskItemInstance()) {
      return this.maskItemInstance.item.mask;
    }
    if (state.values.defaultMaskID === null) {
      throw new Error("Default mask is null");
    }
    return getDefinable(Mask, state.values.defaultMaskID);
  }

  public getOutfit(): Outfit {
    if (this.hasOutfitItemInstance()) {
      return this.outfitItemInstance.item.outfit;
    }
    if (state.values.defaultOutfitID === null) {
      throw new Error("Default outfit is null");
    }
    return getDefinable(Outfit, state.values.defaultOutfitID);
  }

  public remove(): void {
    super.remove();
    if (this._clothesDyeItemInstanceID !== null) {
      this.clothesDyeItemInstance.remove();
    }
    if (this._hairDyeItemInstanceID !== null) {
      this.hairDyeItemInstance.remove();
    }
    if (this._maskItemInstanceID !== null) {
      this.maskItemInstance.remove();
    }
    if (this._outfitItemInstanceID !== null) {
      this.outfitItemInstance.remove();
    }
    if (this._entityID !== null) {
      removeEntity(this._entityID);
    }
  }

  public removeFromWorld(): void {
    if (this._entityID !== null) {
      removeEntity(this._entityID);
    }
  }

  public selectCharacter(): void {
    goToLevel(this._tilemapID);
    this.addToWorld();
    if (this._entityID === null) {
      throw new Error("Entity ID is null");
    }
    lockCameraToEntity(this._entityID);
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
