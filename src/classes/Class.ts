import { Definable } from "../definables";

export interface ClassOptions {
  abbreviation: string;
  description: string;
  defaultClothesDyeItemID: string;
  defaultFigureID: string;
  defaultHairDyeItemID: string;
  defaultMaskItemID: string;
  defaultOutfitItemID: string;
  defaultSkinColorID: string;
  id: string;
  name: string;
  order: number;
}
export class Class extends Definable {
  private readonly _abbreviation: string;
  private readonly _description: string;
  private readonly _defaultClothesDyeItemID: string;
  private readonly _defaultFigureID: string;
  private readonly _defaultHairDyeItemID: string;
  private readonly _defaultMaskItemID: string;
  private readonly _defaultOutfitItemID: string;
  private readonly _defaultSkinColorID: string;
  private readonly _name: string;
  private readonly _order: number;
  public constructor(options: ClassOptions) {
    super(options.id);
    this._abbreviation = options.abbreviation;
    this._description = options.description;
    this._defaultClothesDyeItemID = options.defaultClothesDyeItemID;
    this._defaultFigureID = options.defaultFigureID;
    this._defaultHairDyeItemID = options.defaultHairDyeItemID;
    this._defaultMaskItemID = options.defaultMaskItemID;
    this._defaultOutfitItemID = options.defaultOutfitItemID;
    this._defaultSkinColorID = options.defaultSkinColorID;
    this._name = options.name;
    this._order = options.order;
  }

  public get abbreviation(): string {
    return this._abbreviation;
  }

  public get description(): string {
    return this._description;
  }

  public get defaultClothesDyeItemID(): string {
    return this._defaultClothesDyeItemID;
  }

  public get defaultFigureID(): string {
    return this._defaultFigureID;
  }

  public get defaultHairDyeItemID(): string {
    return this._defaultHairDyeItemID;
  }

  public get defaultMaskItemID(): string {
    return this._defaultMaskItemID;
  }

  public get defaultOutfitItemID(): string {
    return this._defaultOutfitItemID;
  }

  public get defaultSkinColorID(): string {
    return this._defaultSkinColorID;
  }

  public get name(): string {
    return this._name;
  }

  public get order(): number {
    return this._order;
  }
}
