import { Definable } from "definables";
import { QuestGiverDefinition } from "retrommo-types";

export interface QuestGiverOptions {
  definition: QuestGiverDefinition;
  id: string;
}
export class QuestGiver extends Definable {
  public constructor(options: QuestGiverOptions) {
    super(options.id);
  }
}
