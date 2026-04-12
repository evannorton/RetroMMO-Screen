import { ItemInstance } from "../../classes/ItemInstance";
import { State } from "pixel-pigeon";
import { TradeItem, tradeWorldMenu } from "../../world-menus/tradeWorldMenu";
import { WorldStateSchema } from "../../state";
import { getDefinable } from "definables";
import { getWorldState } from "../state/getWorldState";

export const getTradeBagItemInstances = (): readonly ItemInstance[] => {
  const worldState: State<WorldStateSchema> = getWorldState();
  return worldState.values.bagItemInstanceIDs
    .filter(
      (itemInstanceID: string): boolean =>
        tradeWorldMenu.state.values.offeredItems.some(
          (tradeItem: TradeItem): boolean =>
            tradeItem.itemInstanceID === itemInstanceID,
        ) === false,
    )
    .map(
      (itemInstanceID: string): ItemInstance =>
        getDefinable(ItemInstance, itemInstanceID),
    );
};
