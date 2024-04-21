import { Definable } from "../definables";

export interface OutfitOptions {
  bodyCosmeticID: string;
  classIDs: string[];
  id: string;
}
export class Outfit extends Definable {
  public constructor(options: OutfitOptions) {
    super(options.id);
  }
}
