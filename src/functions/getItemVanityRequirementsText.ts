import { Class } from "../classes/Class";
import { getDefinablesCount } from "definables";
import { getItemVanityClasses } from "./getItemVanityClasses";

export const getItemVanityRequirementsText = (itemID: string): string => {
  const classes: readonly Class[] = getItemVanityClasses(itemID);
  let text: string = "";
  if (getDefinablesCount(Class) === classes.length) {
    text += "All";
  } else {
    text += classes
      .map((classObject: Class): string => classObject.abbreviation)
      .join(", ");
  }
  return text;
};
