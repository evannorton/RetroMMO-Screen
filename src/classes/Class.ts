import { CharacterCustomizeStateSchema } from "../state";
import { ClassDefinition } from "retrommo-types";
import { Definable, getDefinable, getDefinables } from "../definables";
import { Figure } from "./Figure";
import { Item } from "./Item";
import { SkinColor } from "./SkinColor";
import { State } from "pixel-pigeon";
import { getCharacterCustomizeState } from "../functions/state/main-menu/getCharacterCustomizeState";

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

  public get clothesDyeItemOrderOffset(): [number, number] {
    if (typeof this._clothesDyeItemOrderOffset !== "undefined") {
      return this._clothesDyeItemOrderOffset;
    }
    throw new Error(this.getAccessorErrorMessage("clothesDyeItemOrderOffset"));
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
    const clothesDyeItemIDs: string[] | undefined =
      this._characterCustomizeClothesDyeItemIDs[indexX];
    if (typeof clothesDyeItemIDs === "undefined") {
      throw new Error(
        "Out of bounds character customize clothes dye item IDs index",
      );
    }
    const clothesDyeItemID: string | undefined = clothesDyeItemIDs[indexY];
    if (typeof clothesDyeItemID === "undefined") {
      throw new Error(
        "Out of bounds character customize clothes dye item ID index",
      );
    }
    return getDefinable(Item, clothesDyeItemID);
  }

  public getCharacterCustomizeFigure(index: number): Figure {
    const figureID: string | undefined =
      this._characterCustomizeFigureIDs[index];
    if (typeof figureID === "undefined") {
      throw new Error("Out of bounds character customize figure index");
    }
    return getDefinable(Figure, figureID);
  }

  public getCharacterCustomizeHairDyeItem(index: number): Item {
    const hairDyeItemID: string | undefined =
      this._characterCustomizeHairDyeItemIDs[index];
    if (typeof hairDyeItemID === "undefined") {
      throw new Error("Out of bounds character customize figure index");
    }
    return getDefinable(Item, hairDyeItemID);
  }

  public getCharacterCustomizeMaskItem(index: number): Item {
    const maskItemID: string | undefined =
      this._characterCustomizeMaskItemIDs[index];
    if (typeof maskItemID === "undefined") {
      throw new Error("Out of bounds character customize figure index");
    }
    return getDefinable(Item, maskItemID);
  }

  public getCharacterCustomizeOutfitItem(index: number): Item {
    const outfitItemID: string | undefined =
      this._characterCustomizeOutfitItemIDs[index];
    if (typeof outfitItemID === "undefined") {
      throw new Error("Out of bounds character customize figure index");
    }
    return getDefinable(Item, outfitItemID);
  }

  public getCharacterCustomizeSkinColor(index: number): SkinColor {
    const skinColorID: string | undefined =
      this._characterCustomizeSkinColorIDs[index];
    if (typeof skinColorID === "undefined") {
      throw new Error("Out of bounds character customize figure index");
    }
    return getDefinable(SkinColor, skinColorID);
  }

  public goToNextCharacterCustomizeClothesDyeItemPrimaryColor(): void {
    const characterCustomizeState: State<CharacterCustomizeStateSchema> =
      getCharacterCustomizeState();
    const lastClothesDyeItemPrimaryColorIndex: number =
      characterCustomizeState.values.clothesDyeItemPrimaryColorIndex;
    const clothesDyeItemPrimaryColorIndex: number =
      lastClothesDyeItemPrimaryColorIndex ===
      this._characterCustomizeClothesDyeItemIDs.length - 1
        ? 0
        : lastClothesDyeItemPrimaryColorIndex + 1;
    characterCustomizeState.setValues({
      clothesDyeItemPrimaryColorIndex,
    });
  }

  public goToNextCharacterCustomizeClothesDyeItemSecondaryColor(): void {
    const characterCustomizeState: State<CharacterCustomizeStateSchema> =
      getCharacterCustomizeState();
    const lastClothesDyeItemSecondaryColorIndex: number =
      characterCustomizeState.values.clothesDyeItemSecondaryColorIndex;
    const clothesDyeItemSecondaryColorIndex: number =
      lastClothesDyeItemSecondaryColorIndex ===
      this._characterCustomizeClothesDyeItemIDs.length - 1
        ? 0
        : lastClothesDyeItemSecondaryColorIndex + 1;
    characterCustomizeState.setValues({
      clothesDyeItemSecondaryColorIndex,
    });
  }

  public goToNextCharacterCustomizeFigure(): void {
    const characterCustomizeState: State<CharacterCustomizeStateSchema> =
      getCharacterCustomizeState();
    const lastFigureIndex: number = characterCustomizeState.values.figureIndex;
    const figureIndex: number =
      lastFigureIndex === 0
        ? this._characterCustomizeFigureIDs.length - 1
        : lastFigureIndex - 1;
    characterCustomizeState.setValues({
      figureIndex,
    });
  }

  public goToNextCharacterCustomizeHairDyeItem(): void {
    const characterCustomizeState: State<CharacterCustomizeStateSchema> =
      getCharacterCustomizeState();
    const lastHairDyeItemIndex: number =
      characterCustomizeState.values.hairDyeItemIndex;
    const hairDyeItemIndex: number =
      lastHairDyeItemIndex === this._characterCustomizeHairDyeItemIDs.length - 1
        ? 0
        : lastHairDyeItemIndex + 1;
    characterCustomizeState.setValues({
      hairDyeItemIndex,
    });
  }

  public goToNextCharacterCustomizeMaskItem(): void {
    const characterCustomizeState: State<CharacterCustomizeStateSchema> =
      getCharacterCustomizeState();
    const lastMaskItemIndex: number =
      characterCustomizeState.values.maskItemIndex;
    const maskItemIndex: number =
      lastMaskItemIndex === this._characterCustomizeMaskItemIDs.length - 1
        ? 0
        : lastMaskItemIndex + 1;
    characterCustomizeState.setValues({
      maskItemIndex,
    });
  }

  public goToNextCharacterCustomizeOutfitItem(): void {
    const characterCustomizeState: State<CharacterCustomizeStateSchema> =
      getCharacterCustomizeState();
    const lastOutfitItemIndex: number =
      characterCustomizeState.values.outfitItemIndex;
    const outfitItemIndex: number =
      lastOutfitItemIndex === this._characterCustomizeOutfitItemIDs.length - 1
        ? 0
        : lastOutfitItemIndex + 1;
    characterCustomizeState.setValues({
      outfitItemIndex,
    });
  }

  public goToNextCharacterCustomizeSkinColor(): void {
    const characterCustomizeState: State<CharacterCustomizeStateSchema> =
      getCharacterCustomizeState();
    const lastSkinColorIndex: number =
      characterCustomizeState.values.skinColorIndex;
    const skinColorIndex: number =
      lastSkinColorIndex === this._characterCustomizeSkinColorIDs.length - 1
        ? 0
        : lastSkinColorIndex + 1;
    characterCustomizeState.setValues({
      skinColorIndex,
    });
  }

  public goToPreviousCharacterCustomizeClothesDyeItemPrimaryColor(): void {
    const characterCustomizeState: State<CharacterCustomizeStateSchema> =
      getCharacterCustomizeState();
    const lastClothesDyeItemPrimaryColorIndex: number =
      characterCustomizeState.values.clothesDyeItemPrimaryColorIndex;
    const clothesDyeItemPrimaryColorIndex: number =
      lastClothesDyeItemPrimaryColorIndex === 0
        ? this._characterCustomizeClothesDyeItemIDs.length - 1
        : lastClothesDyeItemPrimaryColorIndex - 1;
    characterCustomizeState.setValues({
      clothesDyeItemPrimaryColorIndex,
    });
  }

  public goToPreviousCharacterCustomizeClothesDyeItemSecondaryColor(): void {
    const characterCustomizeState: State<CharacterCustomizeStateSchema> =
      getCharacterCustomizeState();
    const lastClothesDyeItemSecondaryColorIndex: number =
      characterCustomizeState.values.clothesDyeItemSecondaryColorIndex;
    const clothesDyeItemSecondaryColorIndex: number =
      lastClothesDyeItemSecondaryColorIndex === 0
        ? this._characterCustomizeClothesDyeItemIDs.length - 1
        : lastClothesDyeItemSecondaryColorIndex - 1;
    characterCustomizeState.setValues({
      clothesDyeItemSecondaryColorIndex,
    });
  }

  public goToPreviousCharacterCustomizeFigure(): void {
    const characterCustomizeState: State<CharacterCustomizeStateSchema> =
      getCharacterCustomizeState();
    const lastFigureIndex: number = characterCustomizeState.values.figureIndex;
    const figureIndex: number =
      lastFigureIndex === this._characterCustomizeFigureIDs.length - 1
        ? 0
        : lastFigureIndex + 1;
    characterCustomizeState.setValues({
      figureIndex,
    });
  }

  public goToPreviousCharacterCustomizeHairDyeItem(): void {
    const characterCustomizeState: State<CharacterCustomizeStateSchema> =
      getCharacterCustomizeState();
    const lastHairDyeItemIndex: number =
      characterCustomizeState.values.hairDyeItemIndex;
    const hairDyeItemIndex: number =
      lastHairDyeItemIndex === 0
        ? this._characterCustomizeHairDyeItemIDs.length - 1
        : lastHairDyeItemIndex - 1;
    characterCustomizeState.setValues({
      hairDyeItemIndex,
    });
  }

  public goToPreviousCharacterCustomizeMaskItem(): void {
    const characterCustomizeState: State<CharacterCustomizeStateSchema> =
      getCharacterCustomizeState();
    const lastMaskItemIndex: number =
      characterCustomizeState.values.maskItemIndex;
    const maskItemIndex: number =
      lastMaskItemIndex === 0
        ? this._characterCustomizeMaskItemIDs.length - 1
        : lastMaskItemIndex - 1;
    characterCustomizeState.setValues({
      maskItemIndex,
    });
  }

  public goToPreviousCharacterCustomizeOutfitItem(): void {
    const characterCustomizeState: State<CharacterCustomizeStateSchema> =
      getCharacterCustomizeState();
    const lastOutfitItemIndex: number =
      characterCustomizeState.values.outfitItemIndex;
    const outfitItemIndex: number =
      lastOutfitItemIndex === 0
        ? this._characterCustomizeOutfitItemIDs.length - 1
        : lastOutfitItemIndex - 1;
    characterCustomizeState.setValues({
      outfitItemIndex,
    });
  }

  public goToPreviousCharacterCustomizeSkinColor(): void {
    const characterCustomizeState: State<CharacterCustomizeStateSchema> =
      getCharacterCustomizeState();
    const lastSkinColorIndex: number =
      characterCustomizeState.values.skinColorIndex;
    const skinColorIndex: number =
      lastSkinColorIndex === 0
        ? this._characterCustomizeSkinColorIDs.length - 1
        : lastSkinColorIndex - 1;
    characterCustomizeState.setValues({
      skinColorIndex,
    });
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
        const clothesDyeItemIDs: string[] | undefined =
          this._characterCustomizeClothesDyeItemIDs[x];
        if (typeof clothesDyeItemIDs === "undefined") {
          throw new Error(
            "Out of bounds character customize clothes dye item IDs index",
          );
        }
        clothesDyeItemIDs[y] = clothesDyeItem.id;
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
