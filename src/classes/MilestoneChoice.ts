import { Ability } from "./Ability";
import { Definable, getDefinable } from "definables";
import { MilestoneChoiceDefinition, Stat } from "retrommo-types";

export interface MilestoneChoiceOptions {
  readonly definition: MilestoneChoiceDefinition;
  readonly id: string;
}
export class MilestoneChoice extends Definable {
  private readonly _description: string;
  private readonly _imagePath: string;
  private readonly _maxHP: boolean;
  private readonly _maxMP: boolean;
  private readonly _name: string;
  private readonly _powerIncreaseAbilityIDs?: readonly string[];
  private readonly _stat?: Stat;
  private readonly _unlockAbilityIDs?: readonly string[];

  public constructor(options: MilestoneChoiceOptions) {
    super(options.id);
    this._description = options.definition.description;
    this._imagePath = options.definition.imagePath;
    this._maxHP = options.definition.maxHP ?? false;
    this._maxMP = options.definition.maxMP ?? false;
    this._name = options.definition.name;
    this._powerIncreaseAbilityIDs = options.definition.powerIncreaseAbilityIDs;
    this._stat = options.definition.stat;
    this._unlockAbilityIDs = options.definition.unlockAbilityIDs;
  }

  public get powerIncreaseAbilities(): readonly Ability[] {
    if (typeof this._powerIncreaseAbilityIDs !== "undefined") {
      return this._powerIncreaseAbilityIDs.map(
        (abilityID: string): Ability => getDefinable(Ability, abilityID),
      );
    }
    throw new Error(this.getAccessorErrorMessage("powerIncreaseAbilities"));
  }

  public get powerIncreaseAbilityIDs(): readonly string[] {
    if (typeof this._powerIncreaseAbilityIDs !== "undefined") {
      return this._powerIncreaseAbilityIDs;
    }
    throw new Error(this.getAccessorErrorMessage("powerIncreaseAbilityIDs"));
  }

  public get description(): string {
    return this._description;
  }

  public get imagePath(): string {
    return this._imagePath;
  }

  public get maxHP(): boolean {
    return this._maxHP;
  }

  public get maxMP(): boolean {
    return this._maxMP;
  }

  public get name(): string {
    return this._name;
  }

  public get stat(): Stat {
    if (typeof this._stat !== "undefined") {
      return this._stat;
    }
    throw new Error(this.getAccessorErrorMessage("stat"));
  }

  public get unlockAbilityIDs(): readonly string[] {
    if (typeof this._unlockAbilityIDs !== "undefined") {
      return this._unlockAbilityIDs;
    }
    throw new Error(this.getAccessorErrorMessage("unlockAbilityIDs"));
  }

  public hasUnlockAbilityIDs(): boolean {
    return typeof this._unlockAbilityIDs !== "undefined";
  }

  public hasPowerIncreaseAbilityIDs(): boolean {
    return typeof this._powerIncreaseAbilityIDs !== "undefined";
  }

  public hasStat(): boolean {
    return typeof this._stat !== "undefined";
  }
}
