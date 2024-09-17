import { ClothesDye } from "../../classes/ClothesDye";
import { Item } from "../../classes/Item";
import { getDefinable } from "../../definables";
import { state } from "../../state";

export const getDefaultedClothesDye = (
  clothesDyeItemID?: string,
): ClothesDye => {
  if (state.values.defaultClothesDyeID === null) {
    throw new Error("defaultClothesDyeID does not exit");
  }
  if (typeof clothesDyeItemID !== "undefined") {
    return getDefinable(Item, clothesDyeItemID).clothesDye;
  }
  return getDefinable(ClothesDye, state.values.defaultClothesDyeID);
};
