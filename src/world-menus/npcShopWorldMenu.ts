import {
  Color,
  ShopItemDefinition,
  WorldBuyShopItemRequest,
  WorldSellShopItemRequest,
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
  selectedBuyIndex: number | null;
  selectedSellIndex: number | null;
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
    const getBuyShopItemsForPage = (): readonly ShopItemDefinition[] => {
      const allShopItems: readonly ShopItemDefinition[] = npc.shop.shopItems;
      const startIndex: number =
        npcShopWorldMenu.state.values.buyPage * buyItemsPerPage;
      return allShopItems.slice(startIndex, startIndex + buyItemsPerPage);
    };
    const getSelectedBuyShopItem = (): ShopItemDefinition => {
      if (npcShopWorldMenu.state.values.selectedBuyIndex === null) {
        throw new Error("selectedBuyIndex is null");
      }
      const shopItems: readonly ShopItemDefinition[] = getBuyShopItemsForPage();
      const shopItem: ShopItemDefinition | undefined =
        shopItems[npcShopWorldMenu.state.values.selectedBuyIndex];
      if (typeof shopItem === "undefined") {
        throw new Error("Selected buy shop item is undefined");
      }
      return shopItem;
    };
    const hasSelectedBuyShopItem = (): boolean =>
      npcShopWorldMenu.state.values.selectedBuyIndex !== null;
    const getSelectedSellItemInstance = (): ItemInstance => {
      if (npcShopWorldMenu.state.values.selectedSellIndex === null) {
        throw new Error("selectedSellIndex is null");
      }
      const itemInstanceID: string | undefined =
        worldState.values.bagItemInstanceIDs[
          npcShopWorldMenu.state.values.selectedSellIndex
        ];
      if (typeof itemInstanceID === "undefined") {
        throw new Error("Selected sell item instance ID is undefined");
      }
      return getDefinable(ItemInstance, itemInstanceID);
    };
    const hasSelectedSellItemInstance = (): boolean => {
      if (npcShopWorldMenu.state.values.selectedSellIndex === null) {
        return false;
      }
      return (
        npcShopWorldMenu.state.values.selectedSellIndex >= 0 &&
        npcShopWorldMenu.state.values.selectedSellIndex <
          worldState.values.bagItemInstanceIDs.length
      );
    };
    const buyTabCondition = (): boolean =>
      npcShopWorldMenu.state.values.tab === NPCShopTab.Buy;
    const sellTabCondition = (): boolean =>
      npcShopWorldMenu.state.values.tab === NPCShopTab.Sell;
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
        maxWidth: 304,
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
            selectedSellIndex: null,
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
            selectedBuyIndex: null,
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
          isSelected: (): boolean =>
            npcShopWorldMenu.state.values.selectedBuyIndex === i,
          onClick: (): void => {
            npcShopWorldMenu.state.setValues({
              selectedBuyIndex:
                npcShopWorldMenu.state.values.selectedBuyIndex === i ? null : i,
              selectedSellIndex: null,
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
          isSelected: (): boolean =>
            npcShopWorldMenu.state.values.selectedSellIndex === i,
          onClick: (): void => {
            npcShopWorldMenu.state.setValues({
              selectedBuyIndex: null,
              selectedSellIndex:
                npcShopWorldMenu.state.values.selectedSellIndex === i
                  ? null
                  : i,
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
      createItemDisplay({
        buttons: [
          {
            condition: (): boolean => {
              if (hasSelectedBuyShopItem()) {
                return (
                  worldState.values.inventoryGold >=
                  getSelectedBuyShopItem().cost
                );
              }
              return false;
            },
            onClick: (): void => {
              emitToSocketioServer<WorldBuyShopItemRequest>({
                data: {
                  itemID: getSelectedBuyShopItem().itemID,
                },
                event: "world/buy-shop-item",
              });
              npcShopWorldMenu.state.setValues({
                selectedBuyIndex: null,
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
            selectedBuyIndex: null,
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
              emitToSocketioServer<WorldSellShopItemRequest>({
                data: {
                  itemInstanceID: getSelectedSellItemInstance().id,
                },
                event: "world/sell-shop-item",
              });
              npcShopWorldMenu.state.setValues({
                selectedSellIndex: null,
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
            selectedSellIndex: null,
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
    selectedBuyIndex: null,
    selectedSellIndex: null,
    tab: NPCShopTab.Buy,
  },
  preventsWalking: true,
});
