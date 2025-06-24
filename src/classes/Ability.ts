import { AbilityDefinition, TargetType } from "retrommo-types";
import { BattleImpactAnimation } from "./BattleImpactAnimation";
import { Boost } from "./Boost";
import { Definable, getDefinable } from "definables";

export interface AbilityOptions {
  readonly definition: AbilityDefinition;
  readonly id: string;
}
export class Ability extends Definable {
  private readonly _battleImpactAnimationID?: string;
  private readonly _battleImpactCritAnimationID?: string;
  private readonly _battleImpactInstakillAnimationID?: string;
  private readonly _boostItemID?: string;
  private readonly _canBeUsedInBattle: boolean;
  private readonly _canBeUsedInWorld: boolean;
  private readonly _chargeNoiseID?: string;
  private readonly _description: string;
  private readonly _fleeChance?: number;
  private readonly _iconImagePath: string;
  private readonly _impactCritNoiseID?: string;
  private readonly _impactInstakillNoiseID?: string;
  private readonly _impactNoiseID?: string;
  private readonly _mpCost: number;
  private readonly _name: string;
  private readonly _targetType: TargetType;
  public constructor(options: AbilityOptions) {
    super(options.id);
    this._battleImpactAnimationID = options.definition.battleImpactAnimationID;
    this._battleImpactCritAnimationID =
      options.definition.battleImpactCritAnimationID;
    this._battleImpactInstakillAnimationID =
      options.definition.battleImpactInstakillAnimationID;
    this._boostItemID = options.definition.boostItemID;
    this._canBeUsedInBattle = options.definition.canBeUsedInBattle ?? false;
    this._canBeUsedInWorld = options.definition.canBeUsedInWorld ?? false;
    this._chargeNoiseID = options.definition.chargeNoiseID;
    this._chargeNoiseID = options.definition.chargeNoiseID;
    this._description = options.definition.description;
    this._fleeChance = options.definition.fleeChance;
    this._iconImagePath = options.definition.iconImagePath;
    this._impactCritNoiseID = options.definition.impactCritNoiseID;
    this._impactInstakillNoiseID = options.definition.impactInstakillNoiseID;
    this._impactNoiseID = options.definition.impactNoiseID;
    this._mpCost = options.definition.mpCost;
    this._name = options.definition.name;
    this._targetType = options.definition.targetType;
  }

  public get battleImpactAnimation(): BattleImpactAnimation {
    if (typeof this._battleImpactAnimationID !== "undefined") {
      return getDefinable(BattleImpactAnimation, this._battleImpactAnimationID);
    }
    throw new Error(this.getAccessorErrorMessage("battleImpactAnimation"));
  }

  public get battleImpactAnimationID(): string {
    if (typeof this._battleImpactAnimationID !== "undefined") {
      return this._battleImpactAnimationID;
    }
    throw new Error(this.getAccessorErrorMessage("battleImpactAnimationID"));
  }

  public get battleImpactCritAnimationID(): string {
    if (typeof this._battleImpactCritAnimationID !== "undefined") {
      return this._battleImpactCritAnimationID;
    }
    throw new Error(
      this.getAccessorErrorMessage("battleImpactCritAnimationID"),
    );
  }

  public get battleImpactInstakillAnimationID(): string {
    if (typeof this._battleImpactInstakillAnimationID !== "undefined") {
      return this._battleImpactInstakillAnimationID;
    }
    throw new Error(
      this.getAccessorErrorMessage("battleImpactInstakillAnimationID"),
    );
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

  public get chargeNoiseID(): string {
    if (typeof this._chargeNoiseID !== "undefined") {
      return this._chargeNoiseID;
    }
    throw new Error(this.getAccessorErrorMessage("chargeNoiseID"));
  }

  public get description(): string {
    return this._description;
  }

  public get fleeChance(): number {
    if (typeof this._fleeChance !== "undefined") {
      return this._fleeChance;
    }
    throw new Error(this.getAccessorErrorMessage("fleeChance"));
  }

  public get iconImagePath(): string {
    return this._iconImagePath;
  }

  public get impactCritNoiseID(): string {
    if (typeof this._impactCritNoiseID !== "undefined") {
      return this._impactCritNoiseID;
    }
    throw new Error(this.getAccessorErrorMessage("impactCritNoiseID"));
  }

  public get impactInstakillNoiseID(): string {
    if (typeof this._impactInstakillNoiseID !== "undefined") {
      return this._impactInstakillNoiseID;
    }
    throw new Error(this.getAccessorErrorMessage("impactInstakillNoiseID"));
  }

  public get impactNoiseID(): string {
    if (typeof this._impactNoiseID !== "undefined") {
      return this._impactNoiseID;
    }
    throw new Error(this.getAccessorErrorMessage("impactNoiseID"));
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

  public hasFleeChance(): boolean {
    return typeof this._fleeChance !== "undefined";
  }
}
