import { ItemInstance } from "../../classes/ItemInstance";
import { ItemInstanceUpdate } from "retrommo-types";

export const loadItemInstanceUpdate = (
  bagItemInstanceUpdate: ItemInstanceUpdate,
): void => {
  new ItemInstance({
    id: bagItemInstanceUpdate.itemInstanceID,
    itemID: bagItemInstanceUpdate.itemID,
  });
};
