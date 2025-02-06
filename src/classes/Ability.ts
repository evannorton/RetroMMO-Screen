import { AbilityDefinition, TargetType } from "retrommo-types";
import { Definable } from "definables";

export interface AbilityOptions {
  readonly definition: AbilityDefinition;
  readonly id: string;
}
export class Ability extends Definable {
  private readonly _canBeUsedInBattle: boolean;
  private readonly _canBeUsedInWorld: boolean;
  private readonly _description: string;
  private readonly _mpCost: number;
  private readonly _name: string;
  private readonly _targetType: TargetType;
  public constructor(options: AbilityOptions) {
    super(options.id);
    this._canBeUsedInBattle = options.definition.canBeUsedInBattle ?? false;
    this._canBeUsedInWorld = options.definition.canBeUsedInWorld ?? false;
    this._description = options.definition.description;
    this._mpCost = options.definition.mpCost;
    this._name = options.definition.name;
    this._targetType = options.definition.targetType;
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

  public get mpCost(): number {
    return this._mpCost;
  }

  public get name(): string {
    return this._name;
  }

  public get targetType(): TargetType {
    return this._targetType;
  }
}
