import { Definable } from "definables";
import { QuestDefinition } from "retrommo-types";

export interface QuestOptions {
  definition: QuestDefinition;
  id: string;
}
export class Quest extends Definable {
  public constructor(options: QuestOptions) {
    super(options.id);
  }
}
