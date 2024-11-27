import { Definable } from "definables";
import { QuestGiverDefinition } from "retrommo-types";

export interface QuestGiverOptions {
  definition: QuestGiverDefinition;
  id: string;
}
export interface QuestGiverQuest {
  readonly questID: string;
}
export class QuestGiver extends Definable {
  private readonly _quests: readonly QuestGiverQuest[] = [];
  public constructor(options: QuestGiverOptions) {
    super(options.id);
    this._quests = options.definition.questGiverQuests.map(
      (
        questGiverQuest: QuestGiverDefinition["questGiverQuests"][0],
      ): QuestGiverQuest => ({
        questID: questGiverQuest.questID,
      }),
    );
  }

  public get quests(): readonly QuestGiverQuest[] {
    return this._quests;
  }
}
