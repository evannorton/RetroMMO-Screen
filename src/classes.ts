import { Definable } from "./definables";

export interface ClassOptions {
  abbreviation: string;
  description: string;
  defaultClothesDyeItemID: string;
  defaultFigureID: string;
  defaultHairDyeItemID: string;
  defaultMaskItemID: string;
  defaultOutfitItemID: string;
  defaultSkinColorID: string;
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
    super();
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
    console.log(this._abbreviation);
    console.log(this._description);
    console.log(this._defaultClothesDyeItemID);
    console.log(this._defaultFigureID);
    console.log(this._defaultHairDyeItemID);
    console.log(this._defaultMaskItemID);
    console.log(this._defaultOutfitItemID);
    console.log(this._defaultSkinColorID);
  }

  public get name(): string {
    return this._name;
  }

  public get order(): number {
    return this._order;
  }
}
new Class({
  abbreviation: "WR",
  defaultClothesDyeItemID: "gray-black-clothes-dye",
  defaultFigureID: "masculine",
  defaultHairDyeItemID: "brown-hair-dye",
  defaultMaskItemID: "barbute",
  defaultOutfitItemID: "armor-1",
  defaultSkinColorID: "skin-2",
  description: "Heavily armored tank and physical damage powerhouse",
  name: "Warrior",
  order: 1,
});
new Class({
  abbreviation: "WZ",
  defaultClothesDyeItemID: "blue-clothes-dye",
  defaultFigureID: "masculine",
  defaultHairDyeItemID: "brown-hair-dye",
  defaultMaskItemID: "wizard-hat",
  defaultOutfitItemID: "robe-1",
  defaultSkinColorID: "skin-2",
  description: "Powerful magic user with frail defenses",
  name: "Wizard",
  order: 2,
});
new Class({
  abbreviation: "CL",
  defaultClothesDyeItemID: "red-white-clothes-dye",
  defaultFigureID: "masculine",
  defaultHairDyeItemID: "brown-hair-dye",
  defaultMaskItemID: "mitre",
  defaultOutfitItemID: "vest-1",
  defaultSkinColorID: "skin-2",
  description: "Master of healing spells and light magic",
  name: "Cleric",
  order: 3,
});
