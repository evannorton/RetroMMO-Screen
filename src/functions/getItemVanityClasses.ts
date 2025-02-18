import { Class } from "../classes/Class";
import { getDefinable } from "definables";
import { getItemVanityClassIDs } from "./getItemVanityClassIDs";

export const getItemVanityClasses = (itemID: string): readonly Class[] =>
  getItemVanityClassIDs(itemID).map(
    (classID: string): Class => getDefinable(Class, classID),
  );
