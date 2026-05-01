import { ItemInstance } from "../../../classes/ItemInstance";
import {
  ItemInstanceUpdate,
  WorldTradeAcceptUpdate,
  WorldTradeCancelUpdate,
  WorldTradeCompleteUpdate,
  WorldTradeIdentifyGoldUpdate,
  WorldTradeIdentifyItemUpdate,
  WorldTradeOfferGoldUpdate,
  WorldTradeOfferItemUpdate,
  WorldTradeStartUpdate,
  WorldTradeUnacceptUpdate,
  WorldTradeUnofferGoldUpdate,
  WorldTradeUnofferItemUpdate,
} from "retrommo-types";
import { State, listenToSocketioEvent } from "pixel-pigeon";
import { TradeItem, tradeWorldMenu } from "../../../world-menus/tradeWorldMenu";
import { WorldCharacter } from "../../../classes/WorldCharacter";
import { WorldStateSchema } from "../../../state";
import { clearWorldCharacterMarker } from "../../clearWorldCharacterMarker";
import { closeWorldMenus } from "../../world-menus/closeWorldMenus";
import { getDefinable, getDefinables } from "definables";
import { getWorldState } from "../../state/getWorldState";
import { loadItemInstanceUpdate } from "../../load-updates/loadItemInstanceUpdate";
import { tradeInviteWorldMenu } from "../../../world-menus/tradeInviteWorldMenu";

export const listenForWorldTradeUpdates = (): void => {
  listenToSocketioEvent<WorldTradeAcceptUpdate>({
    event: "world/trade/accept",
    onMessage: (update: WorldTradeAcceptUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      if (worldState.values.worldCharacterID === update.characterID) {
        tradeWorldMenu.state.setValues({
          hasAccepted: true,
        });
      } else {
        tradeWorldMenu.state.setValues({
          hasTraderAccepted: true,
        });
      }
    },
  });
  listenToSocketioEvent<WorldTradeCancelUpdate>({
    event: "world/trade/cancel",
    onMessage: (): void => {
      for (const tradeItem of tradeWorldMenu.state.values.traderOfferedItems) {
        const traderOfferedItemInstance: ItemInstance = getDefinable(
          ItemInstance,
          tradeItem.itemInstanceID,
        );
        traderOfferedItemInstance.remove();
      }
      tradeWorldMenu.state.setValues({
        isFinishing: true,
      });
      tradeWorldMenu.close();
    },
  });
  listenToSocketioEvent<WorldTradeCompleteUpdate>({
    event: "world/trade/complete",
    onMessage: (update: WorldTradeCompleteUpdate): void => {
      for (const tradeItem of tradeWorldMenu.state.values.traderOfferedItems) {
        const traderOfferedItemInstance: ItemInstance = getDefinable(
          ItemInstance,
          tradeItem.itemInstanceID,
        );
        traderOfferedItemInstance.remove();
      }
      tradeWorldMenu.state.setValues({
        isFinishing: true,
      });
      tradeWorldMenu.close();
      const worldState: State<WorldStateSchema> = getWorldState();
      for (const bagItemInstanceID of worldState.values.bagItemInstanceIDs) {
        const bagItemInstance: ItemInstance = getDefinable(
          ItemInstance,
          bagItemInstanceID,
        );
        bagItemInstance.remove();
      }
      for (const bagItemInstanceUpdate of update.bagItemInstances) {
        loadItemInstanceUpdate(bagItemInstanceUpdate);
      }
      worldState.setValues({
        bagItemInstanceIDs: update.bagItemInstances.map(
          (itemInstanceUpdate: ItemInstanceUpdate): string =>
            itemInstanceUpdate.itemInstanceID,
        ),
        inventoryGold: update.gold,
      });
    },
  });
  listenToSocketioEvent<WorldTradeIdentifyGoldUpdate>({
    event: "world/trade/identify-gold",
    onMessage: (update: WorldTradeIdentifyGoldUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      if (worldState.values.worldCharacterID === update.characterID) {
        tradeWorldMenu.state.setValues({
          isTraderOfferedGoldIdentified: true,
        });
      } else {
        tradeWorldMenu.state.setValues({
          isOfferedGoldIdentified: true,
        });
      }
    },
  });
  listenToSocketioEvent<WorldTradeIdentifyItemUpdate>({
    event: "world/trade/identify-item",
    onMessage: (update: WorldTradeIdentifyItemUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      if (worldState.values.worldCharacterID === update.characterID) {
        const tradeItem: TradeItem | undefined =
          tradeWorldMenu.state.values.traderOfferedItems.find(
            (offeredItem: TradeItem): boolean =>
              offeredItem.itemInstanceID === update.itemInstanceID,
          );
        if (typeof tradeItem === "undefined") {
          throw new Error("Trade item not found");
        }
        tradeItem.isIdentified = true;
      } else {
        const tradeItem: TradeItem | undefined =
          tradeWorldMenu.state.values.offeredItems.find(
            (offeredItem: TradeItem): boolean =>
              offeredItem.itemInstanceID === update.itemInstanceID,
          );
        if (typeof tradeItem === "undefined") {
          throw new Error("Trade item not found");
        }
        tradeItem.isIdentified = true;
      }
    },
  });
  listenToSocketioEvent<WorldTradeOfferItemUpdate>({
    event: "world/trade/offer-item",
    onMessage: (update: WorldTradeOfferItemUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      if (update.characterID === worldState.values.worldCharacterID) {
        if (tradeWorldMenu.state.values.selectedBagItemInstanceID !== null) {
          if (
            update.itemInstance.itemInstanceID ===
            tradeWorldMenu.state.values.selectedBagItemInstanceID
          ) {
            tradeWorldMenu.state.setValues({
              selectedBagItemInstanceID: null,
            });
          }
        }
        tradeWorldMenu.state.setValues({
          hasAccepted: false,
          hasTraderAccepted: false,
          offeredItems: [
            ...tradeWorldMenu.state.values.offeredItems,
            {
              isIdentified: false,
              itemInstanceID: update.itemInstance.itemInstanceID,
            },
          ],
        });
      } else {
        loadItemInstanceUpdate(update.itemInstance);
        tradeWorldMenu.state.setValues({
          hasAccepted: false,
          hasTraderAccepted: false,
          traderOfferedItems: [
            ...tradeWorldMenu.state.values.traderOfferedItems,
            {
              isIdentified: false,
              itemInstanceID: update.itemInstance.itemInstanceID,
            },
          ],
        });
      }
      for (const roomUpdate of update.room) {
        if (roomUpdate.characterID === worldState.values.worldCharacterID) {
          tradeWorldMenu.state.setValues({
            hasRoomForItems: roomUpdate.hasRoom ?? false,
          });
        } else {
          tradeWorldMenu.state.setValues({
            doesTraderHaveRoomForItems: roomUpdate.hasRoom ?? false,
          });
        }
      }
    },
  });
  listenToSocketioEvent<WorldTradeOfferGoldUpdate>({
    event: "world/trade/offer-gold",
    onMessage: (update: WorldTradeOfferGoldUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      if (update.characterID === worldState.values.worldCharacterID) {
        tradeWorldMenu.state.setValues({
          hasAccepted: false,
          hasTraderAccepted: false,
          isOfferedGoldIdentified: false,
          offeredGold: tradeWorldMenu.state.values.offeredGold + update.amount,
          queuedGold: 0,
        });
      } else {
        tradeWorldMenu.state.setValues({
          hasAccepted: false,
          hasTraderAccepted: false,
          isTraderOfferedGoldIdentified: false,
          traderOfferedGold:
            tradeWorldMenu.state.values.traderOfferedGold + update.amount,
        });
      }
      for (const roomUpdate of update.room) {
        if (roomUpdate.characterID === worldState.values.worldCharacterID) {
          tradeWorldMenu.state.setValues({
            hasRoomForGold: roomUpdate.hasRoom ?? false,
          });
        } else {
          tradeWorldMenu.state.setValues({
            doesTraderHaveRoomForGold: roomUpdate.hasRoom ?? false,
          });
        }
      }
    },
  });
  listenToSocketioEvent<WorldTradeStartUpdate>({
    event: "world/trade/start",
    onMessage: (update: WorldTradeStartUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      for (const worldCharacter of getDefinables(WorldCharacter).values()) {
        if (worldCharacter.hasMarkerEntity()) {
          clearWorldCharacterMarker(worldCharacter.id);
        }
      }
      const traderWorldCharacterID: string | undefined =
        update.characterIDs.find(
          (worldCharacterID: string): boolean =>
            worldCharacterID !== worldState.values.worldCharacterID,
        );
      if (typeof traderWorldCharacterID === "undefined") {
        throw new Error("Trader world character ID not found");
      }
      if (tradeInviteWorldMenu.isOpen()) {
        tradeInviteWorldMenu.state.setValues({
          isFinishing: true,
        });
      }
      closeWorldMenus();
      tradeWorldMenu.open({
        doesTraderHaveRoomForGold: true,
        doesTraderHaveRoomForItems: true,
        hasRoomForGold: true,
        hasRoomForItems: true,
        isOfferedGoldIdentified: true,
        isTraderOfferedGoldIdentified: true,
        offeredGold: 0,
        traderOfferedGold: 0,
        traderWorldCharacterID,
      });
    },
  });
  listenToSocketioEvent<WorldTradeUnacceptUpdate>({
    event: "world/trade/unaccept",
    onMessage: (update: WorldTradeUnacceptUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      if (worldState.values.worldCharacterID === update.characterID) {
        tradeWorldMenu.state.setValues({
          hasAccepted: false,
        });
      } else {
        tradeWorldMenu.state.setValues({
          hasTraderAccepted: false,
        });
      }
    },
  });
  listenToSocketioEvent<WorldTradeUnofferItemUpdate>({
    event: "world/trade/unoffer-item",
    onMessage: (update: WorldTradeUnofferItemUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      if (update.characterID === worldState.values.worldCharacterID) {
        if (
          tradeWorldMenu.state.values.selectedOfferedItemInstanceID !== null
        ) {
          if (
            update.itemInstanceID ===
            tradeWorldMenu.state.values.selectedOfferedItemInstanceID
          ) {
            tradeWorldMenu.state.setValues({
              selectedOfferedItemInstanceID: null,
            });
          }
        }
        tradeWorldMenu.state.setValues({
          hasAccepted: false,
          hasTraderAccepted: false,
          isOfferedGoldIdentified: false,
          offeredItems: tradeWorldMenu.state.values.offeredItems
            .filter(
              (tradeItem: TradeItem): boolean =>
                tradeItem.itemInstanceID !== update.itemInstanceID,
            )
            .map(
              (tradeItem: TradeItem): TradeItem => ({
                isIdentified: false,
                itemInstanceID: tradeItem.itemInstanceID,
              }),
            ),
        });
      } else {
        if (
          tradeWorldMenu.state.values.selectedTraderOfferedItemInstanceID !==
          null
        ) {
          if (
            update.itemInstanceID ===
            tradeWorldMenu.state.values.selectedTraderOfferedItemInstanceID
          ) {
            tradeWorldMenu.state.setValues({
              selectedTraderOfferedItemInstanceID: null,
            });
          }
        }
        const itemInstance: ItemInstance = getDefinable(
          ItemInstance,
          update.itemInstanceID,
        );
        tradeWorldMenu.state.setValues({
          hasAccepted: false,
          hasTraderAccepted: false,
          isTraderOfferedGoldIdentified: false,
          traderOfferedItems: tradeWorldMenu.state.values.traderOfferedItems
            .filter(
              (tradeItem: TradeItem): boolean =>
                tradeItem.itemInstanceID !== update.itemInstanceID,
            )
            .map(
              (tradeItem: TradeItem): TradeItem => ({
                isIdentified: false,
                itemInstanceID: tradeItem.itemInstanceID,
              }),
            ),
        });
        itemInstance.remove();
      }
      for (const roomUpdate of update.room) {
        if (roomUpdate.characterID === worldState.values.worldCharacterID) {
          tradeWorldMenu.state.setValues({
            hasRoomForItems: roomUpdate.hasRoom ?? false,
          });
        } else {
          tradeWorldMenu.state.setValues({
            doesTraderHaveRoomForItems: roomUpdate.hasRoom ?? false,
          });
        }
      }
    },
  });
  listenToSocketioEvent<WorldTradeUnofferGoldUpdate>({
    event: "world/trade/unoffer-gold",
    onMessage: (update: WorldTradeUnofferGoldUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      if (worldState.values.worldCharacterID === update.characterID) {
        tradeWorldMenu.state.setValues({
          hasAccepted: false,
          hasTraderAccepted: false,
          isOfferedGoldIdentified: false,
          offeredGold: 0,
        });
      } else {
        tradeWorldMenu.state.setValues({
          hasAccepted: false,
          hasTraderAccepted: false,
          isTraderOfferedGoldIdentified: false,
          traderOfferedGold: 0,
        });
      }
      for (const roomUpdate of update.room) {
        if (roomUpdate.characterID === worldState.values.worldCharacterID) {
          tradeWorldMenu.state.setValues({
            hasRoomForGold: roomUpdate.hasRoom ?? false,
          });
        } else {
          tradeWorldMenu.state.setValues({
            doesTraderHaveRoomForGold: roomUpdate.hasRoom ?? false,
          });
        }
      }
    },
  });
};
