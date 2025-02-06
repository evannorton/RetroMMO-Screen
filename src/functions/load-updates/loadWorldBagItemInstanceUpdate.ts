import { ItemInstance } from "../../classes/ItemInstance";
import { ItemInstanceUpdate } from "retrommo-types";

export const loadWorldBagItemInstanceUpdate = (
  bagItemInstanceUpdate: ItemInstanceUpdate,
): void => {
  new ItemInstance({
    id: bagItemInstanceUpdate.id,
    itemID: bagItemInstanceUpdate.itemID,
  });
};
