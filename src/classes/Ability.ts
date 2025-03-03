import { AbilityDefinition, TargetType } from "retrommo-types";
import { Boost } from "./Boost";
import { Definable, getDefinable } from "definables";

export interface AbilityOptions {
  readonly definition: AbilityDefinition;
  readonly id: string;
}
export class Ability extends Definable {
  private readonly _boostItemID?: string;
  private readonly _canBeUsedInBattle: boolean;
  private readonly _canBeUsedInWorld: boolean;
  private readonly _description: string;
  private readonly _iconImagePath: string;
  private readonly _mpCost: number;
  private readonly _name: string;
  private readonly _targetType: TargetType;
  public constructor(options: AbilityOptions) {
    super(options.id);
    this._boostItemID = options.definition.boostItemID;
    this._canBeUsedInBattle = options.definition.canBeUsedInBattle ?? false;
    this._canBeUsedInWorld = options.definition.canBeUsedInWorld ?? false;
    this._description = options.definition.description;
    this._iconImagePath = options.definition.iconImagePath;
    this._mpCost = options.definition.mpCost;
    this._name = options.definition.name;
    this._targetType = options.definition.targetType;
  }

  public get boost(): Boost {
    if (typeof this._boostItemID !== "undefined") {
      return getDefinable(Boost, this._boostItemID);
    }
    throw new Error(this.getAccessorErrorMessage("boost"));
  }

  public get boostItemID(): string {
    if (typeof this._boostItemID !== "undefined") {
      return this._boostItemID;
    }
    throw new Error(this.getAccessorErrorMessage("boostItemID"));
  }

  public get canBeUsedInBattle(): boolean {
    return this._canBeUsedInBattle;
  }

  public get canBeUsedInWorld(): boolean {
    return this._canBeUsedInWorld;
  }

  public get description(): string {
    return this._description;
  }

  public get iconImagePath(): string {
    return this._iconImagePath;
  }

  public get mpCost(): number {
    return this._mpCost;
  }

  public get name(): string {
    return this._name;
  }

  public get targetType(): TargetType {
    return this._targetType;
  }

  public hasBoost(): boolean {
    return typeof this._boostItemID !== "undefined";
  }
}
