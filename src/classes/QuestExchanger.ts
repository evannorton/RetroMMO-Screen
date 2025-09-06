import { Definable } from "definables";
import { QuestExchangerDefinition } from "retrommo-types";

export interface QuestExchangerOptions {
  readonly definition: QuestExchangerDefinition;
  readonly id: string;
}
export interface QuestExchangerQuest {
  readonly completedText: string;
  readonly isGiver: boolean;
  readonly isReceiver: boolean;
  readonly questID: string;
}
export class QuestExchanger extends Definable {
  private readonly _quests: readonly QuestExchangerQuest[] = [];
  public constructor(options: QuestExchangerOptions) {
    super(options.id);
    this._quests = options.definition.questExchangerQuests.map(
      (
        questExchangerQuest: QuestExchangerDefinition["questExchangerQuests"][0],
      ): QuestExchangerQuest => ({
        completedText: questExchangerQuest.completedText,
        isGiver: questExchangerQuest.isGiver ?? false,
        isReceiver: questExchangerQuest.isReceiver ?? false,
        questID: questExchangerQuest.questID,
      }),
    );
  }

  public get quests(): readonly QuestExchangerQuest[] {
    return this._quests;
  }
}
