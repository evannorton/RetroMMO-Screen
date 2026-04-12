import {
  Color,
  WorldTradeAcceptRequest,
  WorldTradeCancelRequest,
  WorldTradeIdentifyGoldRequest,
  WorldTradeIdentifyItemRequest,
  WorldTradeOfferGoldRequest,
  WorldTradeOfferItemRequest,
  WorldTradeUnacceptRequest,
  WorldTradeUnofferGoldRequest,
  WorldTradeUnofferItemRequest,
} from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createButton,
  createLabel,
  createSprite,
  emitToSocketioServer,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { ItemInstance } from "../classes/ItemInstance";
import { WorldCharacter } from "../classes/WorldCharacter";
import { WorldMenu } from "../classes/WorldMenu";
import { WorldStateSchema } from "../state";
import { createIconListItem } from "../functions/ui/components/createIconListItem";
import { createImage } from "../functions/ui/components/createImage";
import { createItemDisplay } from "../functions/ui/components/createItemDisplay";
import { createPanel } from "../functions/ui/components/createPanel";
import { createPressableButton } from "../functions/ui/components/createPressableButton";
import { createSlot } from "../functions/ui/components/createSlot";
import { getConstants } from "../functions/getConstants";
import { getDefinable } from "definables";
import { getFormattedInteger } from "../functions/getFormattedInteger";
import { getTradeBagItemInstance } from "../functions/trade/const getTradeBagItemInstance";
import { getTradeBagItemInstances } from "../functions/trade/getTradeBagItemInstances";
import { getWorldState } from "../functions/state/getWorldState";
import { grayColors } from "../constants";

enum TradeTab {
  Items = "items",
  Gold = "gold",
}
const tradeGoldIncrements: readonly number[] = [
  1, 10, 100, 1000, 10000, 100000,
];

export interface TradeItem {
  isIdentified: boolean;
  readonly itemInstanceID: string;
}
export interface TradeWorldMenuOpenOptions {
  readonly doesTraderHaveRoomForGold?: boolean;
  readonly doesTraderHaveRoomForItems?: boolean;
  readonly hasAccepted?: boolean;
  readonly hasRoomForGold?: boolean;
  readonly hasRoomForItems?: boolean;
  readonly hasTraderAccepted?: boolean;
  readonly isOfferedGoldIdentified?: boolean;
  readonly isTraderOfferedGoldIdentified?: boolean;
  readonly offeredGold: number;
  readonly offeredItems?: readonly TradeItem[];
  readonly traderOfferedGold: number;
  readonly traderOfferedItems?: readonly TradeItem[];
  readonly traderWorldCharacterID: string;
}
export interface TradeWorldMenuStateSchema {
  doesTraderHaveRoomForGold: boolean;
  doesTraderHaveRoomForItems: boolean;
  hasAccepted: boolean;
  hasRoomForGold: boolean;
  hasRoomForItems: boolean;
  hasTraderAccepted: boolean;
  isFinishing: boolean;
  isOfferedGoldIdentified: boolean;
  isTraderOfferedGoldIdentified: boolean;
  offeredGold: number;
  offeredItems: readonly TradeItem[];
  queuedGold: number;
  selectedOfferedItemIndex: number | null;
  selectedBagItemIndex: number | null;
  selectedTraderOfferedItemIndex: number | null;
  tab: TradeTab;
  traderOfferedGold: number;
  traderOfferedItems: readonly TradeItem[];
}
export const tradeWorldMenu: WorldMenu<
  TradeWorldMenuOpenOptions,
  TradeWorldMenuStateSchema
> = new WorldMenu<TradeWorldMenuOpenOptions, TradeWorldMenuStateSchema>({
  create: (options: TradeWorldMenuOpenOptions): HUDElementReferences => {
    const buttonIDs: string[] = [];
    const hudElementReferences: HUDElementReferences[] = [];
    const labelIDs: string[] = [];
    const spriteIDs: string[] = [];
    const worldState: State<WorldStateSchema> = getWorldState();
    const maximumBagItems: number = getConstants()["maximum-bag-items"];
    const itemsTabCondition = (): boolean =>
      tradeWorldMenu.state.values.tab === TradeTab.Items;
    const goldTabCondition = (): boolean =>
      tradeWorldMenu.state.values.tab === TradeTab.Gold;
    const worldCharacter: WorldCharacter = getDefinable(
      WorldCharacter,
      worldState.values.worldCharacterID,
    );
    const traderWorldCharacter: WorldCharacter = getDefinable(
      WorldCharacter,
      options.traderWorldCharacterID,
    );
    // Bag panel
    hudElementReferences.push(
      createPanel({
        height: 184,
        imagePath: "panels/basic",
        width: 128,
        x: 176,
        y: 24,
      }),
    );
    // Trade panel
    hudElementReferences.push(
      createPanel({
        height: 132,
        imagePath: "panels/basic",
        width: 176,
        x: 0,
        y: 0,
      }),
    );
    // Username
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          x: 88,
          y: 7,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: 304,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: worldCharacter.player.username,
        }),
      }),
    );
    // Description
    labelIDs.push(
      createLabel({
        color: (): Color => {
          if (
            tradeWorldMenu.state.values.isTraderOfferedGoldIdentified ===
              false ||
            tradeWorldMenu.state.values.traderOfferedItems.some(
              (tradeItem: TradeItem): boolean =>
                tradeItem.isIdentified === false,
            ) ||
            tradeWorldMenu.state.values.hasRoomForGold === false ||
            tradeWorldMenu.state.values.hasRoomForItems === false
          ) {
            return Color.BrightRed;
          }
          if (tradeWorldMenu.state.values.hasAccepted) {
            return Color.StrongLimeGreen;
          }
          return Color.LightYellow;
        },
        coordinates: {
          x: 164,
          y: 18,
        },
        horizontalAlignment: "right",
        maxLines: 1,
        maxWidth: 304,
        size: 1,
        text: (): CreateLabelOptionsText => {
          if (
            tradeWorldMenu.state.values.isTraderOfferedGoldIdentified ===
              false ||
            tradeWorldMenu.state.values.traderOfferedItems.some(
              (tradeItem: TradeItem): boolean =>
                tradeItem.isIdentified === false,
            )
          ) {
            return { value: "Offer not identified" };
          }
          if (
            tradeWorldMenu.state.values.hasRoomForGold === false &&
            tradeWorldMenu.state.values.hasRoomForItems === false
          ) {
            return { value: "No room for gold or items" };
          }
          if (tradeWorldMenu.state.values.hasRoomForGold === false) {
            return { value: "No room for gold" };
          }
          if (tradeWorldMenu.state.values.hasRoomForItems === false) {
            return { value: "No room for items" };
          }
          if (tradeWorldMenu.state.values.hasAccepted) {
            return { value: "Accepted" };
          }
          return { value: "Not accepted" };
        },
      }),
    );
    // Offered items
    for (let i: number = 0; i < maximumBagItems; i++) {
      hudElementReferences.push(
        createSlot({
          button: {
            onClick: (): void => {
              if (tradeWorldMenu.state.values.selectedOfferedItemIndex === i) {
                tradeWorldMenu.state.setValues({
                  selectedOfferedItemIndex: null,
                });
              } else {
                tradeWorldMenu.state.setValues({
                  selectedBagItemIndex: null,
                  selectedOfferedItemIndex: i,
                  selectedTraderOfferedItemIndex: null,
                });
              }
            },
          },
          condition: (): boolean =>
            i < tradeWorldMenu.state.values.offeredItems.length,
          icons: [
            {
              imagePath: (): string => {
                const tradeItem: TradeItem | undefined =
                  tradeWorldMenu.state.values.offeredItems[i];
                if (typeof tradeItem === "undefined") {
                  throw new Error("Offered trade item not found");
                }
                const itemInstance: ItemInstance = getDefinable(
                  ItemInstance,
                  tradeItem.itemInstanceID,
                );
                return itemInstance.item.iconImagePath;
              },
            },
          ],
          imagePath: "slots/basic",
          isSelected: (): boolean =>
            tradeWorldMenu.state.values.selectedOfferedItemIndex === i,
          x: 10 + i * 20,
          y: 29,
        }),
      );
    }
    // Offered gold
    hudElementReferences.push(
      createSlot({
        icons: [{ imagePath: "gold" }],
        imagePath: "slots/basic",
        x: 30,
        y: 49,
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          x: 51,
          y: 54,
        },
        horizontalAlignment: "left",
        maxLines: 1,
        maxWidth: 304,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: `${getFormattedInteger(
            tradeWorldMenu.state.values.offeredGold,
          )}g`,
        }),
      }),
    );
    // Cancel gold
    hudElementReferences.push(
      createImage({
        condition: (): boolean => tradeWorldMenu.state.values.offeredGold > 0,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          emitToSocketioServer<WorldTradeUnofferGoldRequest>({
            data: {
              amount: tradeWorldMenu.state.values.offeredGold,
            },
            event: "world/trade/unoffer-gold",
          });
        },
        width: 10,
        x: 15,
        y: 52,
      }),
    );
    // Accept button
    hudElementReferences.push(
      createPressableButton({
        condition: (): boolean =>
          tradeWorldMenu.state.values.isTraderOfferedGoldIdentified &&
          tradeWorldMenu.state.values.traderOfferedItems.every(
            (tradeItem: TradeItem): boolean => tradeItem.isIdentified,
          ) &&
          tradeWorldMenu.state.values.hasAccepted === false &&
          tradeWorldMenu.state.values.hasRoomForGold &&
          tradeWorldMenu.state.values.hasRoomForItems,
        height: 16,
        imagePath: "pressable-buttons/gray",
        onClick: (): void => {
          emitToSocketioServer<WorldTradeAcceptRequest>({
            data: {},
            event: "world/trade/accept",
          });
        },
        text: (): CreateLabelOptionsText => ({ value: "Accept" }),
        width: 48,
        x: 118,
        y: 49,
      }),
    );
    // Cancel button
    hudElementReferences.push(
      createPressableButton({
        condition: (): boolean => tradeWorldMenu.state.values.hasAccepted,
        height: 16,
        imagePath: "pressable-buttons/gray",
        onClick: (): void => {
          emitToSocketioServer<WorldTradeUnacceptRequest>({
            data: {},
            event: "world/trade/unaccept",
          });
        },
        text: (): CreateLabelOptionsText => ({ value: "Cancel" }),
        width: 48,
        x: 118,
        y: 49,
      }),
    );
    // Trader username
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          x: 88,
          y: 68,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: 304,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: traderWorldCharacter.player.username,
        }),
      }),
    );
    // Trader description
    labelIDs.push(
      createLabel({
        color: (): Color => {
          if (
            tradeWorldMenu.state.values.isOfferedGoldIdentified === false ||
            tradeWorldMenu.state.values.offeredItems.some(
              (tradeItem: TradeItem): boolean =>
                tradeItem.isIdentified === false,
            ) ||
            tradeWorldMenu.state.values.doesTraderHaveRoomForGold === false ||
            tradeWorldMenu.state.values.doesTraderHaveRoomForItems === false
          ) {
            return Color.BrightRed;
          }
          if (tradeWorldMenu.state.values.hasTraderAccepted) {
            return Color.StrongLimeGreen;
          }
          return Color.LightYellow;
        },
        coordinates: {
          x: 164,
          y: 79,
        },
        horizontalAlignment: "right",
        maxLines: 1,
        maxWidth: 304,
        size: 1,
        text: (): CreateLabelOptionsText => {
          if (
            tradeWorldMenu.state.values.isOfferedGoldIdentified === false ||
            tradeWorldMenu.state.values.offeredItems.some(
              (tradeItem: TradeItem): boolean =>
                tradeItem.isIdentified === false,
            )
          ) {
            return { value: "Offer not identified" };
          }
          if (
            tradeWorldMenu.state.values.doesTraderHaveRoomForGold === false &&
            tradeWorldMenu.state.values.doesTraderHaveRoomForItems === false
          ) {
            return { value: "No room for gold or items" };
          }
          if (tradeWorldMenu.state.values.doesTraderHaveRoomForGold === false) {
            return { value: "No room for gold" };
          }
          if (
            tradeWorldMenu.state.values.doesTraderHaveRoomForItems === false
          ) {
            return { value: "No room for items" };
          }
          if (tradeWorldMenu.state.values.hasTraderAccepted) {
            return { value: "Accepted" };
          }
          return { value: "Not accepted" };
        },
      }),
    );
    // Trader offered items
    for (let i: number = 0; i < maximumBagItems; i++) {
      hudElementReferences.push(
        createSlot({
          button: {
            onClick: (): void => {
              if (
                tradeWorldMenu.state.values.selectedTraderOfferedItemIndex === i
              ) {
                tradeWorldMenu.state.setValues({
                  selectedTraderOfferedItemIndex: null,
                });
              } else {
                tradeWorldMenu.state.setValues({
                  selectedBagItemIndex: null,
                  selectedOfferedItemIndex: null,
                  selectedTraderOfferedItemIndex: i,
                });
                const tradeItem: TradeItem | undefined =
                  tradeWorldMenu.state.values.traderOfferedItems[i];
                if (typeof tradeItem === "undefined") {
                  throw new Error("Trader offered trade item not found");
                }
                if (tradeItem.isIdentified === false) {
                  emitToSocketioServer<WorldTradeIdentifyItemRequest>({
                    data: {
                      itemInstanceID: tradeItem.itemInstanceID,
                    },
                    event: "world/trade/identify-item",
                  });
                }
              }
            },
          },
          condition: (): boolean =>
            i < tradeWorldMenu.state.values.traderOfferedItems.length,
          icons: [
            {
              imagePath: (): string => {
                const tradeItem: TradeItem | undefined =
                  tradeWorldMenu.state.values.traderOfferedItems[i];
                if (typeof tradeItem === "undefined") {
                  throw new Error("Trader offered trade item not found");
                }
                const itemInstance: ItemInstance = getDefinable(
                  ItemInstance,
                  tradeItem.itemInstanceID,
                );
                return itemInstance.item.iconImagePath;
              },
              palette: (): string[] => {
                const tradeItem: TradeItem | undefined =
                  tradeWorldMenu.state.values.traderOfferedItems[i];
                if (typeof tradeItem === "undefined") {
                  throw new Error("Trader offered trade item not found");
                }
                return tradeItem.isIdentified ? [] : grayColors;
              },
            },
            {
              condition: (): boolean => {
                const tradeItem: TradeItem | undefined =
                  tradeWorldMenu.state.values.traderOfferedItems[i];
                if (typeof tradeItem === "undefined") {
                  throw new Error("Trader offered trade item not found");
                }
                return tradeItem.isIdentified === false;
              },
              imagePath: "unidentified",
            },
          ],
          imagePath: "slots/basic",
          isSelected: (): boolean =>
            tradeWorldMenu.state.values.selectedTraderOfferedItemIndex === i,
          x: 10 + i * 20,
          y: 90,
        }),
      );
    }
    // Trader offered gold
    hudElementReferences.push(
      createSlot({
        button: {
          condition: (): boolean =>
            tradeWorldMenu.state.values.isTraderOfferedGoldIdentified === false,
          onClick: (): void => {
            emitToSocketioServer<WorldTradeIdentifyGoldRequest>({
              data: {},
              event: "world/trade/identify-gold",
            });
          },
        },
        icons: [
          {
            imagePath: "gold",
            palette: (): string[] =>
              tradeWorldMenu.state.values.isTraderOfferedGoldIdentified
                ? []
                : grayColors,
          },
          {
            condition: (): boolean =>
              tradeWorldMenu.state.values.isTraderOfferedGoldIdentified ===
              false,
            imagePath: "unidentified",
          },
        ],
        imagePath: "slots/basic",
        x: 30,
        y: 110,
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            tradeWorldMenu.state.values.isTraderOfferedGoldIdentified,
          x: 51,
          y: 115,
        },
        horizontalAlignment: "left",
        maxLines: 1,
        maxWidth: 304,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: `${getFormattedInteger(
            tradeWorldMenu.state.values.traderOfferedGold,
          )}g`,
        }),
      }),
    );
    // Bag gold
    labelIDs.push(
      createLabel({
        color: Color.LightYellow,
        coordinates: {
          x: 240,
          y: 193,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: 304,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: `${getFormattedInteger(
            worldState.values.inventoryGold -
              tradeWorldMenu.state.values.offeredGold,
          )}g`,
        }),
      }),
    );
    // Selected offered item display
    hudElementReferences.push(
      createItemDisplay({
        buttons: [
          {
            onClick: (): void => {
              const selectedIndex: number | null =
                tradeWorldMenu.state.values.selectedOfferedItemIndex;
              if (selectedIndex === null) {
                throw new Error("Selected offered item index is null");
              }
              const tradeItem: TradeItem | undefined =
                tradeWorldMenu.state.values.offeredItems[selectedIndex];
              if (typeof tradeItem === "undefined") {
                throw new Error("Offered trade item not found");
              }
              emitToSocketioServer<WorldTradeUnofferItemRequest>({
                data: {
                  itemInstanceID: tradeItem.itemInstanceID,
                },
                event: "world/trade/unoffer-item",
              });
            },
            text: "Remove",
            width: 56,
            x: 113,
          },
        ],
        condition: (): boolean =>
          tradeWorldMenu.state.values.selectedOfferedItemIndex !== null,
        itemID: (): string => {
          const index: number | null =
            tradeWorldMenu.state.values.selectedOfferedItemIndex;
          if (index === null) {
            throw new Error("Selected offered item index is null");
          }
          const tradeItem: TradeItem | undefined =
            tradeWorldMenu.state.values.offeredItems[index];
          if (typeof tradeItem === "undefined") {
            throw new Error("Item instance ID not found");
          }
          const itemInstance: ItemInstance = getDefinable(
            ItemInstance,
            tradeItem.itemInstanceID,
          );
          return itemInstance.itemID;
        },
        onClose: (): void => {
          tradeWorldMenu.state.setValues({
            selectedOfferedItemIndex: null,
          });
        },
      }),
    );
    // Selected trader offered item display
    hudElementReferences.push(
      createItemDisplay({
        condition: (): boolean =>
          tradeWorldMenu.state.values.selectedTraderOfferedItemIndex !== null,
        itemID: (): string => {
          const index: number | null =
            tradeWorldMenu.state.values.selectedTraderOfferedItemIndex;
          if (index === null) {
            throw new Error("Selected trader offered item index is null");
          }
          const tradeItem: TradeItem | undefined =
            tradeWorldMenu.state.values.traderOfferedItems[index];
          if (typeof tradeItem === "undefined") {
            throw new Error("Trader offered trade item not found");
          }
          const itemInstance: ItemInstance = getDefinable(
            ItemInstance,
            tradeItem.itemInstanceID,
          );
          return itemInstance.itemID;
        },
        onClose: (): void => {
          tradeWorldMenu.state.setValues({
            selectedTraderOfferedItemIndex: null,
          });
        },
      }),
    );
    // Bag tabs
    spriteIDs.push(
      createSprite({
        animationID: (): string => {
          switch (tradeWorldMenu.state.values.tab) {
            case TradeTab.Items:
              return "1";
            case TradeTab.Gold:
              return "2";
          }
        },
        animations: [
          {
            frames: [
              {
                height: 21,
                sourceHeight: 21,
                sourceWidth: 124,
                sourceX: 0,
                sourceY: 0,
                width: 124,
              },
            ],
            id: "1",
          },
          {
            frames: [
              {
                height: 21,
                sourceHeight: 21,
                sourceWidth: 124,
                sourceX: 124,
                sourceY: 0,
                width: 124,
              },
            ],
            id: "2",
          },
        ],
        coordinates: {
          x: 178,
          y: 26,
        },
        imagePath: "tabs/2",
      }),
    );
    hudElementReferences.push(
      createImage({
        height: 16,
        imagePath: "tab-icons/trade/items",
        width: 16,
        x: 197,
        y: 29,
      }),
    );
    hudElementReferences.push(
      createImage({
        height: 16,
        imagePath: "tab-icons/trade/gold",
        width: 16,
        x: 250,
        y: 29,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: (): boolean => itemsTabCondition() === false,
          x: 179,
          y: 27,
        },
        height: 20,
        onClick: (): void => {
          tradeWorldMenu.state.setValues({
            selectedBagItemIndex: null,
            tab: TradeTab.Items,
          });
        },
        width: 52,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: (): boolean => goldTabCondition() === false,
          x: 233,
          y: 27,
        },
        height: 20,
        onClick: (): void => {
          tradeWorldMenu.state.setValues({
            tab: TradeTab.Gold,
          });
        },
        width: 51,
      }),
    );
    hudElementReferences.push(
      createImage({
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          tradeWorldMenu.close();
        },
        width: 10,
        x: 287,
        y: 31,
      }),
    );
    // Bag items
    for (let i: number = 0; i < maximumBagItems; i++) {
      const y: number = 49 + i * 18;
      hudElementReferences.push(
        createIconListItem({
          condition: (): boolean =>
            itemsTabCondition() && i < getTradeBagItemInstances().length,
          icons: [
            {
              imagePath: (): string =>
                getTradeBagItemInstance(i).item.iconImagePath,
            },
          ],
          isSelected: (): boolean =>
            tradeWorldMenu.state.values.selectedBagItemIndex === i,
          onClick: (): void => {
            if (tradeWorldMenu.state.values.selectedBagItemIndex === i) {
              tradeWorldMenu.state.setValues({
                selectedBagItemIndex: null,
              });
            } else {
              tradeWorldMenu.state.setValues({
                selectedBagItemIndex: i,
                selectedOfferedItemIndex: null,
                selectedTraderOfferedItemIndex: null,
              });
            }
          },
          slotImagePath: "slots/basic",
          text: (): CreateLabelOptionsText => {
            const itemInstanceID: string | undefined =
              worldState.values.bagItemInstanceIDs[i];
            if (typeof itemInstanceID === "undefined") {
              throw new Error("Item instance ID not found");
            }
            const itemInstance: ItemInstance = getDefinable(
              ItemInstance,
              itemInstanceID,
            );
            return {
              value: itemInstance.item.name,
            };
          },
          width: 116,
          x: 182,
          y,
        }),
      );
    }
    // Selected bag item display
    hudElementReferences.push(
      createItemDisplay({
        buttons: [
          {
            onClick: (): void => {
              if (tradeWorldMenu.state.values.selectedBagItemIndex === null) {
                throw new Error("Selected trade item index is null");
              }
              const itemInstance: ItemInstance = getTradeBagItemInstance(
                tradeWorldMenu.state.values.selectedBagItemIndex,
              );
              if (typeof itemInstance === "undefined") {
                throw new Error("Item instance ID not found");
              }
              if (
                tradeWorldMenu.state.values.offeredItems.some(
                  (tradeItem: TradeItem): boolean =>
                    tradeItem.itemInstanceID === itemInstance.id,
                ) === false
              ) {
                emitToSocketioServer<WorldTradeOfferItemRequest>({
                  data: {
                    itemInstanceID: itemInstance.id,
                  },
                  event: "world/trade/offer-item",
                });
              }
            },
            text: "Offer",
            width: 46,
            x: 123,
          },
        ],
        condition: (): boolean =>
          itemsTabCondition() &&
          tradeWorldMenu.state.values.selectedBagItemIndex !== null,
        itemID: (): string => {
          if (tradeWorldMenu.state.values.selectedBagItemIndex === null) {
            throw new Error("Selected trade item index is null");
          }
          const itemInstanceID: string | undefined =
            worldState.values.bagItemInstanceIDs[
              tradeWorldMenu.state.values.selectedBagItemIndex
            ];
          if (typeof itemInstanceID === "undefined") {
            throw new Error("Item instance ID not found");
          }
          const itemInstance: ItemInstance = getDefinable(
            ItemInstance,
            itemInstanceID,
          );
          return itemInstance.itemID;
        },
        onClose: (): void => {
          tradeWorldMenu.state.setValues({
            selectedBagItemIndex: null,
          });
        },
      }),
    );
    // Bag gold controls (minus / amount / plus, aligned with bank deposit gold UI)
    const tradeBagGoldPanelX: number = 176;
    tradeGoldIncrements.forEach((increment: number, key: number): void => {
      hudElementReferences.push(
        createImage({
          condition: goldTabCondition,
          height: 10,
          imagePath: "minus",
          onClick: (): void => {
            const current: number = tradeWorldMenu.state.values.queuedGold;
            const next: number = Math.max(0, current - increment);
            tradeWorldMenu.state.setValues({
              queuedGold: next,
            });
          },
          width: 10,
          x: tradeBagGoldPanelX + 18,
          y: 60 + key * 18,
        }),
      );
      labelIDs.push(
        createLabel({
          color: Color.White,
          coordinates: {
            condition: goldTabCondition,
            x: tradeBagGoldPanelX + 86,
            y: 62 + key * 18,
          },
          horizontalAlignment: "right",
          maxLines: 1,
          maxWidth: 304,
          size: 1,
          text: (): CreateLabelOptionsText => ({
            value: getFormattedInteger(increment),
          }),
        }),
      );
      hudElementReferences.push(
        createImage({
          condition: goldTabCondition,
          height: 10,
          imagePath: "plus",
          onClick: (): void => {
            const queuedGold: number = Math.min(
              tradeWorldMenu.state.values.queuedGold + increment,
              worldState.values.inventoryGold -
                tradeWorldMenu.state.values.offeredGold,
            );
            tradeWorldMenu.state.setValues({
              queuedGold,
            });
          },
          width: 10,
          x: tradeBagGoldPanelX + 100,
          y: 60 + key * 18,
        }),
      );
    });
    hudElementReferences.push(
      createPressableButton({
        condition: goldTabCondition,
        height: 16,
        imagePath: "pressable-buttons/gray",
        onClick: (): void => {
          const amount: number = tradeWorldMenu.state.values.queuedGold;
          if (amount > 0) {
            emitToSocketioServer<WorldTradeOfferGoldRequest>({
              data: {
                amount,
              },
              event: "world/trade/offer-gold",
            });
          }
        },
        text: (): CreateLabelOptionsText => ({
          value: `Offer ${getFormattedInteger(
            tradeWorldMenu.state.values.queuedGold,
          )}g`,
        }),
        width: 112,
        x: 184,
        y: 169,
      }),
    );
    return mergeHUDElementReferences([
      {
        buttonIDs,
        labelIDs,
        spriteIDs,
      },
      ...hudElementReferences,
    ]);
  },
  initialStateValues: (
    options: TradeWorldMenuOpenOptions,
  ): TradeWorldMenuStateSchema => ({
    doesTraderHaveRoomForGold: options.doesTraderHaveRoomForGold ?? false,
    doesTraderHaveRoomForItems: options.doesTraderHaveRoomForItems ?? false,
    hasAccepted: options.hasAccepted ?? false,
    hasRoomForGold: options.hasRoomForGold ?? false,
    hasRoomForItems: options.hasRoomForItems ?? false,
    hasTraderAccepted: options.hasTraderAccepted ?? false,
    isFinishing: false,
    isOfferedGoldIdentified: options.isOfferedGoldIdentified ?? false,
    isTraderOfferedGoldIdentified:
      options.isTraderOfferedGoldIdentified ?? false,
    offeredGold: options.offeredGold,
    offeredItems: options.offeredItems ?? [],
    queuedGold: 0,
    selectedBagItemIndex: null,
    selectedOfferedItemIndex: null,
    selectedTraderOfferedItemIndex: null,
    tab: TradeTab.Items,
    traderOfferedGold: options.traderOfferedGold,
    traderOfferedItems: options.traderOfferedItems ?? [],
  }),
  onClose: (): boolean => {
    if (tradeWorldMenu.state.values.isFinishing) {
      return true;
    }
    emitToSocketioServer<WorldTradeCancelRequest>({
      data: {},
      event: "world/trade/cancel",
    });
    return false;
  },
});
