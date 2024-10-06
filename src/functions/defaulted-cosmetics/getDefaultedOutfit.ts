import { Item } from "../../classes/Item";
import { Outfit } from "../../classes/Outfit";
import { getDefinable } from "definables";
import { state } from "../../state";

export const getDefaultedOutfit = (outfitItemID?: string): Outfit => {
  if (state.values.defaultOutfitID === null) {
    throw new Error("defaultOutfitID does not exit");
  }
  if (typeof outfitItemID !== "undefined") {
    return getDefinable(Item, outfitItemID).outfit;
  }
  return getDefinable(Outfit, state.values.defaultOutfitID);
};
