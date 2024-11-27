import { Definable } from "definables";
import { QuestDefinition } from "retrommo-types";

export interface QuestOptions {
  definition: QuestDefinition;
  id: string;
}
export class Quest extends Definable {
  private readonly _name: string;
  public constructor(options: QuestOptions) {
    super(options.id);
    this._name = options.definition.name;
  }

  public get name(): string {
    return this._name;
  }
}
