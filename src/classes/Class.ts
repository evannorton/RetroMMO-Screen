import { ClassDefinition } from "retrommo-types";
import { Definable, getDefinable } from "../definables";
import { Figure } from "./Figure";
import { Item } from "./Item";
import { SkinColor } from "./SkinColor";

export interface ClassOptions {
  definition: ClassDefinition;
  id: string;
}
export class Class extends Definable {
  private readonly _abbreviation: string;
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
}
