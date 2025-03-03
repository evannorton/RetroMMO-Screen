import { BoostDefinition, Stat } from "retrommo-types";
import { Definable } from "definables";

export interface BoostOptions {
  readonly definition: BoostDefinition;
  readonly id: string;
}
export class Boost extends Definable {
  private readonly _amount: number;
  private readonly _stat: Stat;
  public constructor(options: BoostOptions) {
    super(options.id);
    this._amount = options.definition.amount;
    this._stat = options.definition.stat;
  }

  public get amount(): number {
    return this._amount;
  }

  public get stat(): Stat {
    return this._stat;
  }
}
