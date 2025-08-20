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
  private readonly _chargeAudioPath?: string;
  private readonly _description: string;
  private readonly _fleeChance?: number;
  private readonly _iconImagePath: string;
  private readonly _impactAudioPath?: string;
  private readonly _impactCritAudioPath?: string;
  private readonly _impactInstakillAudioPath?: string;
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
    this._chargeAudioPath = options.definition.chargeAudioPath;
    this._description = options.definition.description;
    this._fleeChance = options.definition.fleeChance;
    this._iconImagePath = options.definition.iconImagePath;
    this._impactAudioPath = options.definition.impactAudioPath;
    this._impactCritAudioPath = options.definition.impactCritAudioPath;
    this._impactInstakillAudioPath =
      options.definition.impactInstakillAudioPath;
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

  public get battleImpactCritAnimation(): BattleImpactAnimation {
    if (typeof this._battleImpactCritAnimationID !== "undefined") {
      return getDefinable(
        BattleImpactAnimation,
        this._battleImpactCritAnimationID,
      );
    }
    throw new Error(this.getAccessorErrorMessage("battleImpactCritAnimation"));
  }

  public get battleImpactCritAnimationID(): string {
    if (typeof this._battleImpactCritAnimationID !== "undefined") {
      return this._battleImpactCritAnimationID;
    }
    throw new Error(
      this.getAccessorErrorMessage("battleImpactCritAnimationID"),
    );
  }

  public get battleImpactInstakillAnimation(): BattleImpactAnimation {
    if (typeof this._battleImpactInstakillAnimationID !== "undefined") {
      return getDefinable(
        BattleImpactAnimation,
        this._battleImpactInstakillAnimationID,
      );
    }
    throw new Error(
      this.getAccessorErrorMessage("battleImpactInstakillAnimation"),
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

  public get chargeAudioPath(): string {
    if (typeof this._chargeAudioPath !== "undefined") {
      return this._chargeAudioPath;
    }
    throw new Error(this.getAccessorErrorMessage("chargeAudioPath"));
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

  public get impactAudioPath(): string {
    if (typeof this._impactAudioPath !== "undefined") {
      return this._impactAudioPath;
    }
    throw new Error(this.getAccessorErrorMessage("impactAudioPath"));
  }

  public get impactCritAudioPath(): string {
    if (typeof this._impactCritAudioPath !== "undefined") {
      return this._impactCritAudioPath;
    }
    throw new Error(this.getAccessorErrorMessage("impactCritAudioPath"));
  }

  public get impactInstakillAudioPath(): string {
    if (typeof this._impactInstakillAudioPath !== "undefined") {
      return this._impactInstakillAudioPath;
    }
    throw new Error(this.getAccessorErrorMessage("impactInstakillAudioPath"));
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

  public hasChargeAudioPath(): boolean {
    return typeof this._chargeAudioPath !== "undefined";
  }

  public hasFleeChance(): boolean {
    return typeof this._fleeChance !== "undefined";
  }
}
