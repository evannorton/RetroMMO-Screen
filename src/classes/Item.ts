import { Ability } from "./Ability";
import { ClothesDye } from "./ClothesDye";
import { Definable, getDefinable } from "definables";
import { EquipmentPiece } from "./EquipmentPiece";
import { HairDye } from "./HairDye";
import { ItemDefinition } from "retrommo-types";
import { Mask } from "./Mask";
import { Outfit } from "./Outfit";

export interface ItemOptions {
  readonly definition: ItemDefinition;
  readonly id: string;
}
export class Item extends Definable {
  private readonly _abilityID?: string;
  private readonly _characterCustomizeClothesDyeOrder?: [number, number];
  private readonly _characterCustomizeHairDyeOrder?: number;
  private readonly _characterCustomizeMaskOrder?: number;
  private readonly _characterCustomizeOutfitOrder?: number;
  private readonly _clothesDyeID?: string;
  private readonly _description?: string;
  private readonly _equipmentPieceID?: string;
  private readonly _hairDyeID?: string;
  private readonly _maskID?: string;
  private readonly _name: string;
  private readonly _outfitID?: string;
  public constructor(options: ItemOptions) {
    super(options.id);
    this._abilityID = options.definition.abilityID;
    this._characterCustomizeClothesDyeOrder =
      options.definition.characterCustomizeClothesDyeOrder;
    this._characterCustomizeHairDyeOrder =
      options.definition.characterCustomizeHairDyeOrder;
    this._characterCustomizeMaskOrder =
      options.definition.characterCustomizeMaskOrder;
    this._characterCustomizeOutfitOrder =
      options.definition.characterCustomizeOutfitOrder;
    this._clothesDyeID = options.definition.clothesDyeID;
    this._description = options.definition.description;
    this._equipmentPieceID = options.definition.equipmentPieceID;
    this._hairDyeID = options.definition.hairDyeID;
    this._maskID = options.definition.maskID;
    this._name = options.definition.name;
    this._outfitID = options.definition.outfitID;
  }

  public get ability(): Ability {
    if (typeof this._abilityID !== "undefined") {
      return getDefinable(Ability, this._abilityID);
    }
    throw new Error(this.getAccessorErrorMessage("ability"));
  }

  public get abilityID(): string {
    if (typeof this._abilityID !== "undefined") {
      return this._abilityID;
    }
    throw new Error(this.getAccessorErrorMessage("abilityID"));
  }

  public get characterCustomizeClothesDyeOrder(): [number, number] | undefined {
    return this._characterCustomizeClothesDyeOrder;
  }

  public get characterCustomizeHairDyeOrder(): number | undefined {
    return this._characterCustomizeHairDyeOrder;
  }

  public get characterCustomizeMaskOrder(): number | undefined {
    return this._characterCustomizeMaskOrder;
  }

  public get characterCustomizeOutfitOrder(): number | undefined {
    return this._characterCustomizeOutfitOrder;
  }

  public get clothesDye(): ClothesDye {
    if (typeof this._clothesDyeID !== "undefined") {
      return getDefinable(ClothesDye, this._clothesDyeID);
    }
    throw new Error(this.getAccessorErrorMessage("clothesDye"));
  }

  public get clothesDyeID(): string {
    if (typeof this._clothesDyeID !== "undefined") {
      return this._clothesDyeID;
    }
    throw new Error(this.getAccessorErrorMessage("clothesDyeID"));
  }

  public get description(): string {
    if (typeof this._description !== "undefined") {
      return this._description;
    }
    throw new Error(this.getAccessorErrorMessage("description"));
  }

  public get equipmentPiece(): EquipmentPiece {
    if (typeof this._equipmentPieceID !== "undefined") {
      return getDefinable(EquipmentPiece, this._equipmentPieceID);
    }
    throw new Error(this.getAccessorErrorMessage("equipmentPiece"));
  }

  public get equipmentPieceID(): string {
    if (typeof this._equipmentPieceID !== "undefined") {
      return this._equipmentPieceID;
    }
    throw new Error(this.getAccessorErrorMessage("equipmentPieceID"));
  }

  public get hairDye(): HairDye {
    if (typeof this._hairDyeID !== "undefined") {
      return getDefinable(HairDye, this._hairDyeID);
    }
    throw new Error(this.getAccessorErrorMessage("hairDye"));
  }

  public get hairDyeID(): string {
    if (typeof this._hairDyeID !== "undefined") {
      return this._hairDyeID;
    }
    throw new Error(this.getAccessorErrorMessage("hairDyeID"));
  }

  public get mask(): Mask {
    if (typeof this._maskID !== "undefined") {
      return getDefinable(Mask, this._maskID);
    }
    throw new Error(this.getAccessorErrorMessage("mask"));
  }

  public get maskID(): string {
    if (typeof this._maskID !== "undefined") {
      return this._maskID;
    }
    throw new Error(this.getAccessorErrorMessage("maskID"));
  }

  public get name(): string {
    return this._name;
  }

  public get outfit(): Outfit {
    if (typeof this._outfitID !== "undefined") {
      return getDefinable(Outfit, this._outfitID);
    }
    throw new Error(this.getAccessorErrorMessage("outfit"));
  }

  public get outfitID(): string {
    if (typeof this._outfitID !== "undefined") {
      return this._outfitID;
    }
    throw new Error(this.getAccessorErrorMessage("outfitID"));
  }

  public hasAbility(): boolean {
    return typeof this._abilityID !== "undefined";
  }

  public hasClothesDye(): boolean {
    return typeof this._clothesDyeID !== "undefined";
  }

  public hasDescription(): boolean {
    return typeof this._description !== "undefined";
  }

  public hasEquipmentPiece(): boolean {
    return typeof this._equipmentPieceID !== "undefined";
  }

  public hasHairDye(): boolean {
    return typeof this._hairDyeID !== "undefined";
  }

  public hasMask(): boolean {
    return typeof this._maskID !== "undefined";
  }

  public hasOutfit(): boolean {
    return typeof this._outfitID !== "undefined";
  }
}
