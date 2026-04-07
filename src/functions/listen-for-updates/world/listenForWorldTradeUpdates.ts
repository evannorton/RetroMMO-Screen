import { ItemInstance } from "../../../classes/ItemInstance";
import {
  ItemInstanceUpdate,
  WorldTradeAcceptUpdate,
  WorldTradeCancelUpdate,
  WorldTradeCompleteUpdate,
  WorldTradeIdentifyGoldUpdate,
  WorldTradeOfferGoldUpdate,
  WorldTradeStartUpdate,
  WorldTradeUnacceptUpdate,
  WorldTradeUnofferGoldUpdate,
} from "retrommo-types";
import { State, listenToSocketioEvent } from "pixel-pigeon";
import { WorldCharacter } from "../../../classes/WorldCharacter";
import { WorldStateSchema } from "../../../state";
import { clearWorldCharacterMarker } from "../../clearWorldCharacterMarker";
import { closeWorldMenus } from "../../world-menus/closeWorldMenus";
import { getDefinable, getDefinables } from "definables";
import { getWorldState } from "../../state/getWorldState";
import { loadItemInstanceUpdate } from "../../load-updates/loadItemInstanceUpdate";
import { tradeWorldMenu } from "../../../world-menus/tradeWorldMenu";

export const listenForWorldTradeUpdates = (): void => {
  listenToSocketioEvent<WorldTradeAcceptUpdate>({
    event: "world/trade/accept",
    onMessage: (update: WorldTradeAcceptUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      if (worldState.values.worldCharacterID === update.worldCharacterID) {
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
      for (const offeredItemInstanceID of tradeWorldMenu.state.values
        .offeredItemInstanceIDs) {
        const offeredItemInstance: ItemInstance = getDefinable(
          ItemInstance,
          offeredItemInstanceID,
        );
        offeredItemInstance.remove();
      }
      for (const traderOfferedItemInstanceID of tradeWorldMenu.state.values
        .traderOfferedItemInstanceIDs) {
        const traderOfferedItemInstance: ItemInstance = getDefinable(
          ItemInstance,
          traderOfferedItemInstanceID,
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
      for (const offeredItemInstanceID of tradeWorldMenu.state.values
        .offeredItemInstanceIDs) {
        const offeredItemInstance: ItemInstance = getDefinable(
          ItemInstance,
          offeredItemInstanceID,
        );
        offeredItemInstance.remove();
      }
      for (const traderOfferedItemInstanceID of tradeWorldMenu.state.values
        .traderOfferedItemInstanceIDs) {
        const traderOfferedItemInstance: ItemInstance = getDefinable(
          ItemInstance,
          traderOfferedItemInstanceID,
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
      if (worldState.values.worldCharacterID === update.worldCharacterID) {
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
  listenToSocketioEvent<WorldTradeOfferGoldUpdate>({
    event: "world/trade/offer-gold",
    onMessage: (update: WorldTradeOfferGoldUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      if (update.worldCharacterID === worldState.values.worldCharacterID) {
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
        if (
          roomUpdate.worldCharacterID === worldState.values.worldCharacterID
        ) {
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
      closeWorldMenus();
      for (const worldCharacter of getDefinables(WorldCharacter).values()) {
        if (worldCharacter.hasMarkerEntity()) {
          clearWorldCharacterMarker(worldCharacter.id);
        }
      }
      const traderWorldCharacterID: string | undefined =
        update.worldCharacterIDs.find(
          (worldCharacterID: string): boolean =>
            worldCharacterID !== worldState.values.worldCharacterID,
        );
      if (typeof traderWorldCharacterID === "undefined") {
        throw new Error("Trader world character ID not found");
      }
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
      if (worldState.values.worldCharacterID === update.worldCharacterID) {
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
  listenToSocketioEvent<WorldTradeUnofferGoldUpdate>({
    event: "world/trade/unoffer-gold",
    onMessage: (update: WorldTradeUnofferGoldUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      if (worldState.values.worldCharacterID === update.worldCharacterID) {
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
        if (
          roomUpdate.worldCharacterID === worldState.values.worldCharacterID
        ) {
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
