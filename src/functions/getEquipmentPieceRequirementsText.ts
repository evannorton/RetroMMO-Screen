import { Class } from "../classes/Class";
import { EquipmentPiece } from "../classes/EquipmentPiece";
import { getDefinable, getDefinablesCount } from "definables";
import { getFormattedInteger } from "./getFormattedInteger";

export const getEquipmentPieceRequirementsText = (
  equipmentPieceID: string,
): string => {
  const equipmentPiece: EquipmentPiece = getDefinable(
    EquipmentPiece,
    equipmentPieceID,
  );
  const classes: readonly Class[] = equipmentPiece.classes;
  let text: string = `Lv${getFormattedInteger(equipmentPiece.level)} - `;
  if (getDefinablesCount(Class) === classes.length) {
    text += "All";
  } else {
    text += classes
      .map((classObject: Class): string => classObject.abbreviation)
      .join(", ");
  }
  return text;
};
