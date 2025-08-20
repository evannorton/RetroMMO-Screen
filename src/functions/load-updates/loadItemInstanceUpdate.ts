import { ItemInstance } from "../../classes/ItemInstance";
import { ItemInstanceUpdate } from "retrommo-types";

export const loadItemInstanceUpdate = (
  itemInstanceUpdate: ItemInstanceUpdate,
): void => {
  new ItemInstance({
    id: itemInstanceUpdate.itemInstanceID,
    itemID: itemInstanceUpdate.itemID,
  });
};
