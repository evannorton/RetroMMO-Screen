import { ClassDefinition } from "retrommo-types";
import { Definable, getDefinable, getDefinables } from "../definables";
import { Figure } from "./Figure";
import { Item } from "./Item";
import { SkinColor } from "./SkinColor";

export interface ClassOptions {
  definition: ClassDefinition;
  id: string;
}
export class Class extends Definable {
  private readonly _abbreviation: string;
  private readonly _characterCustomizeClothesDyeItemIDs: string[][] = [];
  private readonly _characterCustomizeFigureIDs: string[] = [];
  private readonly _characterCustomizeHairDyeItemIDs: string[] = [];
  private readonly _characterCustomizeMaskItemIDs: string[] = [];
  private readonly _characterCustomizeOutfitItemIDs: string[] = [];
  private readonly _characterCustomizeSkinColorIDs: string[] = [];
  private _clothesDyeItemOrderOffset?: [number, number] = undefined;
  private readonly _description: string;
  private readonly _defaultClothesDyeID: string;
  private readonly _defaultFigureID: string;
  private readonly _defaultHairDyeID: string;
  private readonly _defaultMaskItemID: string;
  private readonly _defaultOutfitItemID: string;
  private readonly _name: string;
  private readonly _order: number;
  private readonly _skinColorID: string;
  public constructor(options: ClassOptions) {
    super(options.id);
    this._abbreviation = options.definition.abbreviation;
    this._description = options.definition.description;
    this._defaultClothesDyeID = options.definition.defaultClothesDyeItemID;
    this._defaultFigureID = options.definition.defaultFigureID;
    this._defaultHairDyeID = options.definition.defaultHairDyeItemID;
    this._defaultMaskItemID = options.definition.defaultMaskItemID;
    this._defaultOutfitItemID = options.definition.defaultOutfitItemID;
    this._name = options.definition.name;
    this._order = options.definition.order;
    this._skinColorID = options.definition.defaultSkinColorID;
  }

  public get abbreviation(): string {
    return this._abbreviation;
  }

  public get description(): string {
    return this._description;
  }

  public get defaultClothesDyeItem(): Item {
    return getDefinable(Item, this._defaultClothesDyeID);
  }

  public get defaultFigure(): Figure {
    return getDefinable(Figure, this._defaultFigureID);
  }

  public get defaultHairDyeItem(): Item {
    return getDefinable(Item, this._defaultHairDyeID);
  }

  public get defaultMaskItem(): Item {
    return getDefinable(Item, this._defaultMaskItemID);
  }

  public get defaultOutfitItem(): Item {
    return getDefinable(Item, this._defaultOutfitItemID);
  }

  public get defaultSkinColor(): SkinColor {
    return getDefinable(SkinColor, this._skinColorID);
  }

  public get name(): string {
    return this._name;
  }

  public get order(): number {
    return this._order;
  }

  public getCharacterCustomizeClothesDyeItem(
    indexX: number,
    indexY: number,
  ): Item {
    if (typeof this._clothesDyeItemOrderOffset === "undefined") {
      throw new Error(
        "Attempted to get character customize clothes dye item with no clothes dye item order offset.",
      );
    }
    const [offsetX, offsetY]: number[] = this._clothesDyeItemOrderOffset;
    return getDefinable(
      Item,
      this._characterCustomizeClothesDyeItemIDs[indexX + offsetX][
        indexY + offsetY
      ],
    );
  }

  public getCharacterCustomizeFigure(index: number): Figure {
    return getDefinable(Figure, this._characterCustomizeFigureIDs[index]);
  }

  public getCharacterCustomizeHairDyeItem(index: number): Item {
    return getDefinable(Item, this._characterCustomizeHairDyeItemIDs[index]);
  }

  public getCharacterCustomizeMaskItem(index: number): Item {
    return getDefinable(Item, this._characterCustomizeMaskItemIDs[index]);
  }

  public getCharacterCustomizeOutfitItem(index: number): Item {
    return getDefinable(Item, this._characterCustomizeOutfitItemIDs[index]);
  }

  public getCharacterCustomizeSkinColor(index: number): SkinColor {
    return getDefinable(SkinColor, this._characterCustomizeSkinColorIDs[index]);
  }

  public populateCharacterCustomizeOptions(): void {
    for (const skinColor of getDefinables(SkinColor).values()) {
      if (typeof skinColor.characterCustomizeOrder !== "undefined") {
        this._characterCustomizeSkinColorIDs[
          skinColor.characterCustomizeOrder
        ] = skinColor.id;
      }
    }
    for (const figure of getDefinables(Figure).values()) {
      if (typeof figure.characterCustomizeOrder !== "undefined") {
        this._characterCustomizeFigureIDs[figure.characterCustomizeOrder] =
          figure.id;
      }
    }
    for (const clothesDyeItem of getDefinables(Item).values()) {
      if (
        typeof clothesDyeItem.characterCustomizeClothesDyeOrder !== "undefined"
      ) {
        const [x, y] = clothesDyeItem.characterCustomizeClothesDyeOrder;
        if (
          typeof this._characterCustomizeClothesDyeItemIDs[x] === "undefined"
        ) {
          this._characterCustomizeClothesDyeItemIDs[x] = [];
        }
        this._characterCustomizeClothesDyeItemIDs[x][y] = clothesDyeItem.id;
      }
    }
    for (const item of getDefinables(Item).values()) {
      if (
        item.id === this._defaultClothesDyeID &&
        typeof item.characterCustomizeClothesDyeOrder !== "undefined"
      ) {
        this._clothesDyeItemOrderOffset =
          item.characterCustomizeClothesDyeOrder;
        break;
      }
    }
    for (const hairDyeItem of getDefinables(Item).values()) {
      if (typeof hairDyeItem.characterCustomizeHairDyeOrder !== "undefined") {
        this._characterCustomizeHairDyeItemIDs[
          hairDyeItem.characterCustomizeHairDyeOrder
        ] = hairDyeItem.id;
      }
    }
    for (const maskItem of getDefinables(Item).values()) {
      if (
        typeof maskItem.characterCustomizeMaskOrder !== "undefined" &&
        maskItem.mask.canClassEquip(this._id)
      ) {
        this._characterCustomizeMaskItemIDs[
          maskItem.characterCustomizeMaskOrder
        ] = maskItem.id;
      }
    }
    for (const outfitItem of getDefinables(Item).values()) {
      if (
        typeof outfitItem.characterCustomizeOutfitOrder !== "undefined" &&
        outfitItem.outfit.canClassEquip(this._id)
      ) {
        this._characterCustomizeOutfitItemIDs[
          outfitItem.characterCustomizeOutfitOrder
        ] = outfitItem.id;
      }
    }
  }
}
