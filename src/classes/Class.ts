import { CharacterCustomizeStateSchema } from "../state";
import { ClassDefinition, ResourcePool } from "retrommo-types";
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
  private _clothesDyeItemOrderOffset: [number, number] | null = null;
  private readonly _description: string;
  private readonly _defaultClothesDyeItemID: string;
  private readonly _defaultFigureID: string;
  private readonly _defaultHairDyeItemID: string;
  private readonly _defaultMaskItemID: string;
  private readonly _defaultOutfitItemID: string;
  private readonly _defaultSkinColorID: string;
  private _figureOrderOffset: number | null = null;
  private _hairDyeItemOrderOffset: number | null = null;
  private _maskItemOrderOffset: number | null = null;
  private readonly _name: string;
  private readonly _order: number;
  private _outfitItemOrderOffset: number | null = null;
  private readonly _resourcePool: ResourcePool;
  private _skinColorOrderOffset: number | null = null;
  public constructor(options: ClassOptions) {
    super(options.id);
    this._abbreviation = options.definition.abbreviation;
    this._description = options.definition.description;
    this._defaultClothesDyeItemID = options.definition.defaultClothesDyeItemID;
    this._defaultFigureID = options.definition.defaultFigureID;
    this._defaultHairDyeItemID = options.definition.defaultHairDyeItemID;
    this._defaultMaskItemID = options.definition.defaultMaskItemID;
    this._defaultOutfitItemID = options.definition.defaultOutfitItemID;
    this._defaultSkinColorID = options.definition.defaultSkinColorID;
    this._name = options.definition.name;
    this._order = options.definition.order;
    this._resourcePool = options.definition.resourcePool;
  }

  public get abbreviation(): string {
    return this._abbreviation;
  }

  public get clothesDyeItemOrderOffset(): [number, number] {
    if (this._clothesDyeItemOrderOffset !== null) {
      return this._clothesDyeItemOrderOffset;
    }
    throw new Error(this.getAccessorErrorMessage("clothesDyeItemOrderOffset"));
  }

  public get description(): string {
    return this._description;
  }

  public get defaultClothesDyeItem(): Item {
    return getDefinable(Item, this._defaultClothesDyeItemID);
  }

  public get defaultFigure(): Figure {
    return getDefinable(Figure, this._defaultFigureID);
  }

  public get defaultHairDyeItem(): Item {
    return getDefinable(Item, this._defaultHairDyeItemID);
  }

  public get defaultMaskItem(): Item {
    return getDefinable(Item, this._defaultMaskItemID);
  }

  public get defaultOutfitItem(): Item {
    return getDefinable(Item, this._defaultOutfitItemID);
  }

  public get defaultSkinColor(): SkinColor {
    return getDefinable(SkinColor, this._defaultSkinColorID);
  }

  public get figureOrderOffset(): number {
    if (this._figureOrderOffset !== null) {
      return this._figureOrderOffset;
    }
    throw new Error(this.getAccessorErrorMessage("figureOrderOffset"));
  }

  public get hairDyeItemOrderOffset(): number {
    if (this._hairDyeItemOrderOffset !== null) {
      return this._hairDyeItemOrderOffset;
    }
    throw new Error(this.getAccessorErrorMessage("hairDyeItemOrderOffset"));
  }

  public get maskItemOrderOffset(): number {
    if (this._maskItemOrderOffset !== null) {
      return this._maskItemOrderOffset;
    }
    throw new Error(this.getAccessorErrorMessage("maskItemOrderOffset"));
  }

  public get name(): string {
    return this._name;
  }

  public get order(): number {
    return this._order;
  }

  public get outfitItemOrderOffset(): number {
    if (this._outfitItemOrderOffset !== null) {
      return this._outfitItemOrderOffset;
    }
    throw new Error(this.getAccessorErrorMessage("outfitItemOrderOffset"));
  }

  public get resourcePool(): ResourcePool {
    return this._resourcePool;
  }

  public get skinColorOrderOffset(): number {
    if (this._skinColorOrderOffset !== null) {
      return this._skinColorOrderOffset;
    }
    throw new Error(this.getAccessorErrorMessage("skinColorOrderOffset"));
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
        item.id === this._defaultClothesDyeItemID &&
        typeof item.characterCustomizeClothesDyeOrder !== "undefined"
      ) {
        this._clothesDyeItemOrderOffset =
          item.characterCustomizeClothesDyeOrder;
        break;
      }
    }
    for (const figure of getDefinables(Figure).values()) {
      if (
        figure.id === this._defaultFigureID &&
        typeof figure.characterCustomizeOrder !== "undefined"
      ) {
        this._figureOrderOffset = figure.characterCustomizeOrder;
        break;
      }
    }
    for (const item of getDefinables(Item).values()) {
      if (
        item.id === this._defaultHairDyeItemID &&
        typeof item.characterCustomizeHairDyeOrder !== "undefined"
      ) {
        this._hairDyeItemOrderOffset = item.characterCustomizeHairDyeOrder;
        break;
      }
    }
    for (const item of getDefinables(Item).values()) {
      if (
        item.id === this._defaultMaskItemID &&
        typeof item.characterCustomizeMaskOrder !== "undefined"
      ) {
        this._maskItemOrderOffset = item.characterCustomizeMaskOrder;
        break;
      }
    }
    for (const item of getDefinables(Item).values()) {
      if (
        item.id === this._defaultOutfitItemID &&
        typeof item.characterCustomizeOutfitOrder !== "undefined"
      ) {
        this._outfitItemOrderOffset = item.characterCustomizeOutfitOrder;
        break;
      }
    }
    for (const skinColor of getDefinables(SkinColor).values()) {
      if (
        skinColor.id === this._defaultSkinColorID &&
        typeof skinColor.characterCustomizeOrder !== "undefined"
      ) {
        this._skinColorOrderOffset = skinColor.characterCustomizeOrder;
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
