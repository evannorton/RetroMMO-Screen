import { Item } from "../classes/Item";
import { getDefinable } from "definables";

export const getItemVanitySlotText = (itemID: string): string => {
  const item: Item = getDefinable(Item, itemID);
  if (item.hasClothesDye()) {
    return "Clothes Dye";
  }
  if (item.hasHairDye()) {
    return "Hair Dye";
  }
  if (item.hasMask()) {
    return "Mask";
  }
  if (item.hasOutfit()) {
    return "Outfit";
  }
  throw new Error("Item has no vanity");
};
