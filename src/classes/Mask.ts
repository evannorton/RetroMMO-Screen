import { Definable } from "../definables";

export interface MaskOptions {
  id: string;
  classIDs: string[];
  headCosmeticID: string;
}
export class Mask extends Definable {
  public constructor(options: MaskOptions) {
    super(options.id);
  }
}
