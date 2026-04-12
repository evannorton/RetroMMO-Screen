import {
  Color,
  ShopItemDefinition,
  WorldShopBuyItemRequest,
  WorldShopSellItemRequest,
} from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createButton,
  createLabel,
  createSprite,
  emitToSocketioServer,
  getGameWidth,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { Item } from "../classes/Item";
import { ItemInstance } from "../classes/ItemInstance";
import { NPC } from "../classes/NPC";
import { WorldMenu } from "../classes/WorldMenu";
import { WorldStateSchema } from "../state";
import { createIconListItem } from "../functions/ui/components/createIconListItem";
import { createImage } from "../functions/ui/components/createImage";
import { createItemDisplay } from "../functions/ui/components/createItemDisplay";
import { createPanel } from "../functions/ui/components/createPanel";
import { getConstants } from "../functions/getConstants";
import { getCyclicIndex } from "../functions/getCyclicIndex";
import { getDefinable } from "definables";
import { getFormattedInteger } from "../functions/getFormattedInteger";
import { getWorldState } from "../functions/state/getWorldState";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";

enum NPCShopTab {
  Buy = "buy",
  Sell = "sell",
}
const buyItemsPerPage: number = 7;

export interface NPCShopWorldMenuOpenOptions {
  readonly isLeader: boolean;
  readonly npcID: string;
}
export interface NPCShopWorldMenuStateSchema {
  buyPage: number;
  selectedBuyItemID: string | null;
  selectedSellItemInstanceID: string | null;
  tab: NPCShopTab;
}
export const npcShopWorldMenu: WorldMenu<
  NPCShopWorldMenuOpenOptions,
  NPCShopWorldMenuStateSchema
> = new WorldMenu<NPCShopWorldMenuOpenOptions, NPCShopWorldMenuStateSchema>({
  create: (options: NPCShopWorldMenuOpenOptions): HUDElementReferences => {
    const buttonIDs: string[] = [];
    const hudElementReferences: HUDElementReferences[] = [];
    const labelIDs: string[] = [];
    const spriteIDs: string[] = [];
    const npc: NPC = getDefinable(NPC, options.npcID);
    const worldState: State<WorldStateSchema> = getWorldState();
    const condition = (): boolean =>
      options.isLeader && isWorldCombatInProgress() === false;
    const x: number = 176;
    const y: number = 24;
    const width: number = 128;
    const height: number = 184;
    const maximumBagItems: number = getConstants()["maximum-bag-items"];
    const gameWidth: number = getGameWidth();
    const getBuyShopItemsForPage = (): readonly ShopItemDefinition[] => {
      const allShopItems: readonly ShopItemDefinition[] = npc.shop.shopItems;
      const startIndex: number =
        npcShopWorldMenu.state.values.buyPage * buyItemsPerPage;
      return allShopItems.slice(startIndex, startIndex + buyItemsPerPage);
    };
    const getSelectedBuyShopItem = (): ShopItemDefinition => {
      if (npcShopWorldMenu.state.values.selectedBuyItemID === null) {
        throw new Error("selectedBuyItemID is null");
      }
      const shopItem: ShopItemDefinition | undefined = npc.shop.shopItems.find(
        (definition: ShopItemDefinition): boolean =>
          definition.itemID === npcShopWorldMenu.state.values.selectedBuyItemID,
      );
      if (typeof shopItem === "undefined") {
        throw new Error("Selected buy shop item is undefined");
      }
      return shopItem;
    };
    const hasSelectedBuyShopItem = (): boolean => {
      if (npcShopWorldMenu.state.values.selectedBuyItemID === null) {
        return false;
      }
      return npc.shop.shopItems.some(
        (definition: ShopItemDefinition): boolean =>
          definition.itemID === npcShopWorldMenu.state.values.selectedBuyItemID,
      );
    };
    const getSelectedSellItemInstance = (): ItemInstance => {
      if (npcShopWorldMenu.state.values.selectedSellItemInstanceID === null) {
        throw new Error("selectedSellItemInstanceID is null");
      }
      return getDefinable(
        ItemInstance,
        npcShopWorldMenu.state.values.selectedSellItemInstanceID,
      );
    };
    const hasSelectedSellItemInstance = (): boolean => {
      if (npcShopWorldMenu.state.values.selectedSellItemInstanceID === null) {
        return false;
      }
      return worldState.values.bagItemInstanceIDs.includes(
        npcShopWorldMenu.state.values.selectedSellItemInstanceID,
      );
    };
    const buyTabCondition = (): boolean =>
      npcShopWorldMenu.state.values.tab === NPCShopTab.Buy;
    const sellTabCondition = (): boolean =>
      npcShopWorldMenu.state.values.tab === NPCShopTab.Sell;
    const getBuyLastPage = (): number =>
      Math.max(0, Math.ceil(npc.shop.shopItems.length / buyItemsPerPage) - 1);
    const isBuyPaginated = (): boolean =>
      npc.shop.shopItems.length > buyItemsPerPage;
    const pageBuy = (offset: number): void => {
      const pages: number[] = [];
      for (let i: number = 0; i < getBuyLastPage() + 1; i++) {
        pages.push(i);
      }
      npcShopWorldMenu.state.setValues({
        buyPage: getCyclicIndex(
          pages.indexOf(npcShopWorldMenu.state.values.buyPage) + offset,
          pages,
        ),
      });
    };
    const selectedItemDisplayCondition = (): boolean =>
      condition() &&
      (hasSelectedBuyShopItem() || hasSelectedSellItemInstance());
    hudElementReferences.push(
      createPanel({
        condition,
        height,
        imagePath: "panels/basic",
        width,
        x,
        y,
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.LightYellow,
        coordinates: {
          condition,
          x: 240,
          y: 193,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: gameWidth,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: `${getFormattedInteger(worldState.values.inventoryGold)}g`,
        }),
      }),
    );
    spriteIDs.push(
      createSprite({
        animationID: (): string => {
          switch (npcShopWorldMenu.state.values.tab) {
            case NPCShopTab.Buy:
              return "1";
            case NPCShopTab.Sell:
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
          condition,
          x: 178,
          y: 26,
        },
        imagePath: "tabs/2",
      }),
    );
    hudElementReferences.push(
      createImage({
        condition,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          npcShopWorldMenu.close();
        },
        width: 10,
        x: x + width - 17,
        y: y + 7,
      }),
    );
    hudElementReferences.push(
      createImage({
        condition,
        height: 16,
        imagePath: "tab-icons/shop/buy",
        width: 16,
        x: 197,
        y: 29,
      }),
    );
    hudElementReferences.push(
      createImage({
        condition,
        height: 16,
        imagePath: "tab-icons/shop/sell",
        width: 16,
        x: 250,
        y: 29,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: (): boolean => condition() && sellTabCondition(),
          x: 179,
          y: 27,
        },
        height: 20,
        onClick: (): void => {
          npcShopWorldMenu.state.setValues({
            selectedSellItemInstanceID: null,
            tab: NPCShopTab.Buy,
          });
        },
        width: 52,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: (): boolean => condition() && buyTabCondition(),
          x: 232,
          y: 27,
        },
        height: 20,
        onClick: (): void => {
          npcShopWorldMenu.state.setValues({
            selectedBuyItemID: null,
            tab: NPCShopTab.Sell,
          });
        },
        width: 51,
      }),
    );
    for (let i: number = 0; i < buyItemsPerPage; i++) {
      const yOffset: number = 49 + i * 18;
      hudElementReferences.push(
        createIconListItem({
          condition: (): boolean =>
            condition() &&
            buyTabCondition() &&
            typeof getBuyShopItemsForPage()[i] !== "undefined",
          icons: [
            {
              imagePath: (): string => {
                const shopItem: ShopItemDefinition | undefined =
                  getBuyShopItemsForPage()[i];
                if (typeof shopItem === "undefined") {
                  throw new Error("Shop item is undefined");
                }
                return getDefinable(Item, shopItem.itemID).iconImagePath;
              },
            },
          ],
          isSelected: (): boolean => {
            const shopItem: ShopItemDefinition | undefined =
              getBuyShopItemsForPage()[i];
            if (typeof shopItem === "undefined") {
              return false;
            }
            return (
              npcShopWorldMenu.state.values.selectedBuyItemID ===
              shopItem.itemID
            );
          },
          onClick: (): void => {
            const shopItem: ShopItemDefinition | undefined =
              getBuyShopItemsForPage()[i];
            if (typeof shopItem === "undefined") {
              throw new Error("Shop item is undefined");
            }
            const slotBuyItemID: string = shopItem.itemID;
            npcShopWorldMenu.state.setValues({
              selectedBuyItemID:
                npcShopWorldMenu.state.values.selectedBuyItemID ===
                slotBuyItemID
                  ? null
                  : slotBuyItemID,
              selectedSellItemInstanceID: null,
            });
          },
          slotImagePath: "slots/basic",
          text: (): CreateLabelOptionsText => {
            const shopItem: ShopItemDefinition | undefined =
              getBuyShopItemsForPage()[i];
            if (typeof shopItem === "undefined") {
              throw new Error("Shop item is undefined");
            }
            return {
              value: getDefinable(Item, shopItem.itemID).name,
            };
          },
          width: 116,
          x: 182,
          y: yOffset,
        }),
      );
    }
    for (let i: number = 0; i < maximumBagItems; i++) {
      const yOffset: number = 49 + i * 18;
      hudElementReferences.push(
        createIconListItem({
          condition: (): boolean =>
            condition() &&
            sellTabCondition() &&
            i < worldState.values.bagItemInstanceIDs.length,
          icons: [
            {
              imagePath: (): string => {
                const bagItemInstanceID: string | undefined =
                  worldState.values.bagItemInstanceIDs[i];
                if (typeof bagItemInstanceID === "undefined") {
                  throw new Error("Bag item instance ID is undefined");
                }
                return getDefinable(ItemInstance, bagItemInstanceID).item
                  .iconImagePath;
              },
            },
          ],
          isSelected: (): boolean => {
            const slotItemInstanceID: string | undefined =
              worldState.values.bagItemInstanceIDs[i];
            if (typeof slotItemInstanceID === "undefined") {
              return false;
            }
            return (
              npcShopWorldMenu.state.values.selectedSellItemInstanceID ===
              slotItemInstanceID
            );
          },
          onClick: (): void => {
            const slotItemInstanceID: string | undefined =
              worldState.values.bagItemInstanceIDs[i];
            if (typeof slotItemInstanceID === "undefined") {
              throw new Error("Bag item instance ID is undefined");
            }
            npcShopWorldMenu.state.setValues({
              selectedBuyItemID: null,
              selectedSellItemInstanceID:
                npcShopWorldMenu.state.values.selectedSellItemInstanceID ===
                slotItemInstanceID
                  ? null
                  : slotItemInstanceID,
            });
          },
          slotImagePath: "slots/basic",
          text: (): CreateLabelOptionsText => {
            const bagItemInstanceID: string | undefined =
              worldState.values.bagItemInstanceIDs[i];
            if (typeof bagItemInstanceID === "undefined") {
              throw new Error("Bag item instance ID is undefined");
            }
            return {
              value: getDefinable(ItemInstance, bagItemInstanceID).item.name,
            };
          },
          width: 116,
          x: 182,
          y: yOffset,
        }),
      );
    }
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          condition() && buyTabCondition() && isBuyPaginated(),
        height: 14,
        imagePath: "arrows/left",
        onClick: (): void => {
          pageBuy(-1);
        },
        width: 14,
        x: 190,
        y: 176,
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          condition() && buyTabCondition() && isBuyPaginated(),
        height: 14,
        imagePath: "arrows/right",
        onClick: (): void => {
          pageBuy(1);
        },
        width: 14,
        x: 275,
        y: 176,
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            condition() && buyTabCondition() && isBuyPaginated(),
          x: 296,
          y: 193,
        },
        horizontalAlignment: "right",
        maxLines: 1,
        maxWidth: gameWidth,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: String(npcShopWorldMenu.state.values.buyPage + 1),
        }),
      }),
    );
    hudElementReferences.push(
      createItemDisplay({
        buttons: [
          {
            condition: (): boolean => {
              if (hasSelectedBuyShopItem()) {
                const hasEnoughGold: boolean =
                  worldState.values.inventoryGold >=
                  getSelectedBuyShopItem().cost;
                const isInventoryFull: boolean =
                  worldState.values.bagItemInstanceIDs.length >=
                  maximumBagItems;
                return hasEnoughGold && isInventoryFull === false;
              }
              return false;
            },
            onClick: (): void => {
              emitToSocketioServer<WorldShopBuyItemRequest>({
                data: {
                  itemID: getSelectedBuyShopItem().itemID,
                },
                event: "world/shop/buy-item",
              });
            },
            text: "Buy",
            width: 34,
            x: 135,
          },
        ],
        condition: (): boolean =>
          selectedItemDisplayCondition() && buyTabCondition(),
        gold: (): number => getSelectedBuyShopItem().cost,
        itemID: (): string => getSelectedBuyShopItem().itemID,
        onClose: (): void => {
          npcShopWorldMenu.state.setValues({
            selectedBuyItemID: null,
          });
        },
      }),
    );
    hudElementReferences.push(
      createItemDisplay({
        buttons: [
          {
            condition: (): boolean => hasSelectedSellItemInstance(),
            onClick: (): void => {
              emitToSocketioServer<WorldShopSellItemRequest>({
                data: {
                  itemInstanceID: getSelectedSellItemInstance().id,
                },
                event: "world/shop/sell-item",
              });
            },
            text: "Sell",
            width: 34,
            x: 135,
          },
        ],
        condition: (): boolean =>
          selectedItemDisplayCondition() && sellTabCondition(),
        gold: (): number => getSelectedSellItemInstance().item.value,
        itemID: (): string => getSelectedSellItemInstance().itemID,
        onClose: (): void => {
          npcShopWorldMenu.state.setValues({
            selectedSellItemInstanceID: null,
          });
        },
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
  initialStateValues: {
    buyPage: 0,
    selectedBuyItemID: null,
    selectedSellItemInstanceID: null,
    tab: NPCShopTab.Buy,
  },
  preventsWalking: true,
});
