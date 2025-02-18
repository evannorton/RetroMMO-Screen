import { Item } from "../classes/Item";
import { getDefinable } from "definables";

export const doesItemHaveVanity = (itemID: string): boolean => {
  const item: Item = getDefinable(Item, itemID);
  return (
    item.hasClothesDye() ||
    item.hasHairDye() ||
    item.hasMask() ||
    item.hasOutfit()
  );
};
