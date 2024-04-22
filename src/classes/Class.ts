import { ClassDefinition } from "retrommo-types";
import { Definable, getDefinable } from "../definables";
import { Item } from "./Items";

export interface ClassOptions {
  definition: ClassDefinition;
  id: string;
}
export class Class extends Definable {
  private readonly _abbreviation: string;
  private readonly _description: string;
  private readonly _defaultMaskItemID: string;
  private readonly _defaultOutfitItemID: string;
  private readonly _name: string;
  private readonly _order: number;
  public constructor(options: ClassOptions) {
    super(options.id);
    this._abbreviation = options.definition.abbreviation;
    this._description = options.definition.description;
    this._defaultMaskItemID = options.definition.defaultMaskItemSlug;
    this._defaultOutfitItemID = options.definition.defaultOutfitItemSlug;
    this._name = options.definition.name;
    this._order = options.definition.order;
  }

  public get abbreviation(): string {
    return this._abbreviation;
  }

  public get description(): string {
    return this._description;
  }

  public get defaultMaskItem(): Item {
    return getDefinable(Item, this._defaultMaskItemID);
  }

  public get defaultOutfitItem(): Item {
    return getDefinable(Item, this._defaultOutfitItemID);
  }

  public get name(): string {
    return this._name;
  }

  public get order(): number {
    return this._order;
  }
}
