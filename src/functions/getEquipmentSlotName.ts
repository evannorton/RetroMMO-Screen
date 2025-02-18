import { EquipmentSlot } from "retrommo-types";

export const getEquipmentSlotName = (equipmentSlot: EquipmentSlot): string => {
  switch (equipmentSlot) {
    case EquipmentSlot.Body:
      return "Body";
    case EquipmentSlot.Head:
      return "Head";
    case EquipmentSlot.MainHand:
      return "Main Hand";
    case EquipmentSlot.OffHand:
      return "Off Hand";
  }
};
