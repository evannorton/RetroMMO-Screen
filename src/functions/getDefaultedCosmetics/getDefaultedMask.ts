import { Item } from "../../classes/Item";
import { Mask } from "../../classes/Mask";
import { getDefinable } from "../../definables";
import { state } from "../../state";

export const getDefaultedMask = (maskItemID?: string): Mask => {
  if (state.values.defaultMaskID === null) {
    throw new Error("defaultMaskID does not exit");
  }
  if (typeof maskItemID !== "undefined") {
    return getDefinable(Item, maskItemID).mask;
  }
  return getDefinable(Mask, state.values.defaultMaskID);
};
