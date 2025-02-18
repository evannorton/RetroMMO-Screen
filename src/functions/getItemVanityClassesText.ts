import { Class } from "../classes/Class";
import { getDefinablesCount } from "definables";
import { getItemVanityClasses } from "./getItemVanityClasses";

export const getItemVanityClassesText = (itemID: string): string => {
  const classes: readonly Class[] = getItemVanityClasses(itemID);
  if (getDefinablesCount(Class) === classes.length) {
    return "All";
  }
  return classes
    .map((classObject: Class): string => classObject.abbreviation)
    .join(", ");
};
