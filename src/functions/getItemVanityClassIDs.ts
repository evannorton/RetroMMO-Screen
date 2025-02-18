import { Item } from "../classes/Item";
import { getDefinable } from "definables";

export const getItemVanityClassIDs = (itemID: string): readonly string[] => {
  const item: Item = getDefinable(Item, itemID);
  if (item.hasClothesDye()) {
    return item.clothesDye.classIDs;
  }
  if (item.hasHairDye()) {
    return item.hairDye.classIDs;
  }
  if (item.hasMask()) {
    return item.mask.classIDs;
  }
  if (item.hasOutfit()) {
    return item.outfit.classIDs;
  }
  throw new Error("Item has no vanity");
};
