import { Class } from "../classes/Class";
import { EquipmentPiece } from "../classes/EquipmentPiece";
import { getDefinable, getDefinablesCount } from "definables";

export const getEquipmentPieceClassesText = (
  equipmentPieceID: string,
): string => {
  const equipmentPiece: EquipmentPiece = getDefinable(
    EquipmentPiece,
    equipmentPieceID,
  );
  const classes: readonly Class[] = equipmentPiece.classes;
  if (getDefinablesCount(Class) === classes.length) {
    return "All";
  }
  return classes
    .map((classObject: Class): string => classObject.abbreviation)
    .join(", ");
};
