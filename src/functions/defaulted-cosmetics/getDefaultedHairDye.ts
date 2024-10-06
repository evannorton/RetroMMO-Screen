import { HairDye } from "../../classes/HairDye";
import { Item } from "../../classes/Item";
import { getDefinable } from "definables";
import { state } from "../../state";

export const getDefaultedHairDye = (hairDyeItemID?: string): HairDye => {
  if (state.values.defaultHairDyeID === null) {
    throw new Error("defaultHairDyeID does not exit");
  }
  if (typeof hairDyeItemID !== "undefined") {
    return getDefinable(Item, hairDyeItemID).hairDye;
  }
  return getDefinable(HairDye, state.values.defaultHairDyeID);
};
