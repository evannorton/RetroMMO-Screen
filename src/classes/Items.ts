import { Definable } from "../definables";

export interface ItemOptions {
  abilityID: string | null;
  clothesDyeID: string | null;
  description: string | null;
  equipmentPieceID: string | null;
  hairDyeID: string | null;
  id: string;
  imageSourceID: string;
  isConsumable: boolean;
  isTradable: boolean;
  maskID: string | null;
  name: string;
  outfitID: string | null;
  value: number;
}
export class Item extends Definable {
  public constructor(options: ItemOptions) {
    super(options.id);
  }
}
