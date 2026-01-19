import { ItemInstance } from "../../../classes/ItemInstance";
import { State, listenToSocketioEvent } from "pixel-pigeon";
import {
  WorldShopBuyItemUpdate,
  WorldShopSellItemUpdate,
} from "retrommo-types";
import { WorldStateSchema } from "../../../state";
import { getDefinable } from "definables";
import { getWorldState } from "../../state/getWorldState";

export const listenForWorldShopUpdates = (): void => {
  listenToSocketioEvent<WorldShopBuyItemUpdate>({
    event: "world/shop/buy-item",
    onMessage: (update: WorldShopBuyItemUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      worldState.setValues({
        bagItemInstanceIDs: [
          ...worldState.values.bagItemInstanceIDs,
          update.itemInstance.itemInstanceID,
        ],
        inventoryGold: update.gold,
      });
      new ItemInstance({
        id: update.itemInstance.itemInstanceID,
        itemID: update.itemInstance.itemID,
      });
    },
  });
  listenToSocketioEvent<WorldShopSellItemUpdate>({
    event: "world/shop/sell-item",
    onMessage: (update: WorldShopSellItemUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      worldState.setValues({
        bagItemInstanceIDs: worldState.values.bagItemInstanceIDs.filter(
          (bagItemInstanceID: string): boolean =>
            bagItemInstanceID !== update.itemInstanceID,
        ),
        inventoryGold: update.gold,
      });
      getDefinable(ItemInstance, update.itemInstanceID).remove();
    },
  });
};
