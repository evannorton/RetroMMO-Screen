import { Definable, getDefinable } from "definables";
import { NPC } from "./NPC";
import { QuestDefinition } from "retrommo-types";

export interface QuestMonster {
  readonly kills: number;
  readonly monsterID: string;
}
export interface QuestOptions {
  readonly definition: QuestDefinition;
  readonly id: string;
}
export class Quest extends Definable {
  private readonly _availableText: string;
  private readonly _experience: number;
  private readonly _giverNPCID: string;
  private readonly _gold: number;
  private readonly _inProgressText: string;
  private readonly _monster?: QuestMonster;
  private readonly _name: string;
  private readonly _prerequisiteQuestID?: string;
  private readonly _receiverNPCID: string;
  public constructor(options: QuestOptions) {
    super(options.id);
    this._availableText = options.definition.availableText;
    this._experience = options.definition.experience;
    this._giverNPCID = options.definition.giverNPCID;
    this._gold = options.definition.gold;
    this._inProgressText = options.definition.inProgressText;
    this._monster =
      typeof options.definition.monster !== "undefined"
        ? {
            kills: options.definition.monster.kills,
            monsterID: options.definition.monster.monsterID,
          }
        : undefined;
    this._name = options.definition.name;
    this._prerequisiteQuestID = options.definition.prerequisiteQuestID;
    this._receiverNPCID = options.definition.receiverNPCID;
  }

  public get availableText(): string {
    return this._availableText;
  }

  public get experience(): number {
    return this._experience;
  }

  public get giverNPC(): NPC {
    return getDefinable(NPC, this._giverNPCID);
  }

  public get giverNPCID(): string {
    return this._giverNPCID;
  }

  public get gold(): number {
    return this._gold;
  }

  public get inProgressText(): string {
    return this._inProgressText;
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

  public get prerequisiteQuestID(): string {
    if (typeof this._prerequisiteQuestID !== "undefined") {
      return this._prerequisiteQuestID;
    }
    throw new Error(this.getAccessorErrorMessage("prerequisiteQuestID"));
  }

  public get receiverNPC(): NPC {
    return getDefinable(NPC, this._receiverNPCID);
  }

  public get receiverNPCID(): string {
    return this._receiverNPCID;
  }

  public hasMonster(): boolean {
    return typeof this._monster !== "undefined";
  }

  public hasPrerequisiteQuest(): boolean {
    return typeof this._prerequisiteQuestID !== "undefined";
  }
}
