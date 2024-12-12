import { Definable, getDefinable } from "definables";
import { NPC } from "./NPC";
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
  private readonly _availableText: string;
  private readonly _completedText: string;
  private readonly _experience: number;
  private readonly _gold: number;
  private readonly _inProgressText: string;
  private readonly _monster?: QuestMonster;
  private readonly _name: string;
  private readonly _npcID: string;
  public constructor(options: QuestOptions) {
    super(options.id);
    this._availableText = options.definition.availableText;
    this._completedText = options.definition.completedText;
    this._experience = options.definition.experience;
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
    this._npcID = options.definition.npcID;
  }

  public get availableText(): string {
    return this._availableText;
  }

  public get completedText(): string {
    return this._completedText;
  }

  public get experience(): number {
    return this._experience;
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

  public get npcID(): string {
    return this._npcID;
  }

  public get npc(): NPC {
    return getDefinable(NPC, this._npcID);
  }

  public hasMonster(): boolean {
    return typeof this._monster !== "undefined";
  }
}
