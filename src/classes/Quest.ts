import { Definable } from "definables";
import { QuestDefinition } from "retrommo-types";

export interface QuestMonster {
  readonly kills: number;
  readonly monsterID: string;
}
export interface QuestOptions {
  definition: QuestDefinition;
  id: string;
}
export class Quest extends Definable {
  private readonly _description: string;
  private readonly _monster?: QuestMonster;
  private readonly _name: string;
  public constructor(options: QuestOptions) {
    super(options.id);
    this._description = options.definition.description;
    this._monster =
      typeof options.definition.monster !== "undefined"
        ? {
            kills: options.definition.monster.kills,
            monsterID: options.definition.monster.monsterID,
          }
        : undefined;
    this._name = options.definition.name;
  }

  public get description(): string {
    return this._description;
  }

  public get monster(): QuestMonster {
    if (typeof this._monster !== "undefined") {
      return this._monster;
    }
    throw new Error("Quest does not have a monster");
  }

  public get name(): string {
    return this._name;
  }

  public hasMonster(): boolean {
    return typeof this._monster !== "undefined";
  }
}
