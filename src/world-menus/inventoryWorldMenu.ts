import { Color, TargetType, WorldUseItemInstanceRequest } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createButton,
  createInputPressHandler,
  createLabel,
  createSprite,
  emitToSocketioServer,
  getCurrentTime,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { Item } from "../classes/Item";
import { ItemInstance } from "../classes/ItemInstance";
import { WorldCharacter } from "../classes/WorldCharacter";
import { WorldMenu } from "../classes/WorldMenu";
import { WorldStateSchema } from "../state";
import { bagItemsPerPage } from "../constants";
import { createIconListItem } from "../functions/ui/components/createIconListItem";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { createSelectedItemDisplay } from "../functions/ui/components/createItemDisplay";
import { createSlot } from "../functions/ui/components/createSlot";
import { getDefinable } from "definables";
import { getFormattedInteger } from "../functions/getFormattedInteger";
import { getWorldState } from "../functions/state/getWorldState";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";
import {
  targetWorldPartyCharacter1InputCollectionID,
  targetWorldPartyCharacter2InputCollectionID,
  targetWorldPartyCharacter3InputCollectionID,
} from "../input";

enum InventoryTab {
  Bag = "bag",
  Equipment = "equipment",
  Vanity = "vanity",
}

export const getBagItemInstance = (i: number): ItemInstance => {
  const worldState: State<WorldStateSchema> = getWorldState();
  const itemInstanceID: string | undefined =
    worldState.values.bagItemInstanceIDs[i];
  if (typeof itemInstanceID === "undefined") {
    throw new Error("Item instance ID not found");
  }
  return getDefinable(ItemInstance, itemInstanceID);
};
export interface InventoryWorldMenuOpenOptions {}
export interface InventoryWorldMenuStateSchema {
  isAwaitingWorldCombat: boolean;
  selectedBagItemIndex: number | null;
  startedTargetingAt: number | null;
  tab: InventoryTab;
}
export const inventoryWorldMenu: WorldMenu<
  InventoryWorldMenuOpenOptions,
  InventoryWorldMenuStateSchema
> = new WorldMenu<InventoryWorldMenuOpenOptions, InventoryWorldMenuStateSchema>(
  {
    create: (): HUDElementReferences => {
      const hudElementReferences: HUDElementReferences[] = [];
      const buttonIDs: string[] = [];
      const inputPressHandlerIDs: string[] = [];
      const labelIDs: string[] = [];
      const spriteIDs: string[] = [];
      const worldState: State<WorldStateSchema> = getWorldState();
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        worldState.values.worldCharacterID,
      );
      const bagTabCondition = (): boolean =>
        inventoryWorldMenu.state.values.tab === InventoryTab.Bag;
      const equipmentTabCondition = (): boolean =>
        inventoryWorldMenu.state.values.tab === InventoryTab.Equipment;
      const vanityTabCondition = (): boolean =>
        inventoryWorldMenu.state.values.tab === InventoryTab.Vanity;
      // Background panel
      hudElementReferences.push(
        createPanel({
          condition: (): boolean =>
            inventoryWorldMenu.state.values.startedTargetingAt === null &&
            isWorldCombatInProgress() === false,
          height: 184,
          imagePath: "panels/basic",
          width: 128,
          x: 176,
          y: 24,
        }),
      );
      // Tabs
      spriteIDs.push(
        createSprite({
          animationID: (): string => {
            switch (inventoryWorldMenu.state.values.tab) {
              case InventoryTab.Bag:
                return "1";
              case InventoryTab.Equipment:
                return "2";
              case InventoryTab.Vanity:
                return "3";
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
            {
              frames: [
                {
                  height: 21,
                  sourceHeight: 21,
                  sourceWidth: 124,
                  sourceX: 248,
                  sourceY: 0,
                  width: 124,
                },
              ],
              id: "3",
            },
          ],
          coordinates: {
            condition: (): boolean =>
              inventoryWorldMenu.state.values.startedTargetingAt === null &&
              isWorldCombatInProgress() === false,
            x: 178,
            y: 26,
          },
          imagePath: "tabs/3",
        }),
      );
      hudElementReferences.push(
        createImage({
          condition: (): boolean =>
            inventoryWorldMenu.state.values.startedTargetingAt === null &&
            isWorldCombatInProgress() === false,
          height: 16,
          imagePath: "tab-icons/inventory/bag",
          width: 16,
          x: 188,
          y: 29,
        }),
      );
      hudElementReferences.push(
        createImage({
          condition: (): boolean =>
            inventoryWorldMenu.state.values.startedTargetingAt === null &&
            isWorldCombatInProgress() === false,
          height: 16,
          imagePath: "tab-icons/inventory/equipment",
          width: 16,
          x: 223,
          y: 29,
        }),
      );
      hudElementReferences.push(
        createImage({
          condition: (): boolean =>
            inventoryWorldMenu.state.values.startedTargetingAt === null &&
            isWorldCombatInProgress() === false,
          height: 16,
          imagePath: "tab-icons/inventory/vanity",
          width: 16,
          x: 258,
          y: 29,
        }),
      );
      buttonIDs.push(
        createButton({
          coordinates: {
            condition: (): boolean =>
              inventoryWorldMenu.state.values.startedTargetingAt === null &&
              bagTabCondition() === false &&
              isWorldCombatInProgress() === false,
            x: 179,
            y: 27,
          },
          height: 20,
          onClick: (): void => {
            inventoryWorldMenu.state.setValues({
              tab: InventoryTab.Bag,
            });
          },
          width: 34,
        }),
      );
      buttonIDs.push(
        createButton({
          coordinates: {
            condition: (): boolean =>
              inventoryWorldMenu.state.values.startedTargetingAt === null &&
              equipmentTabCondition() === false &&
              isWorldCombatInProgress() === false,
            x: 214,
            y: 27,
          },
          height: 20,
          onClick: (): void => {
            inventoryWorldMenu.state.setValues({
              selectedBagItemIndex: null,
              tab: InventoryTab.Equipment,
            });
          },
          width: 34,
        }),
      );
      buttonIDs.push(
        createButton({
          coordinates: {
            condition: (): boolean =>
              inventoryWorldMenu.state.values.startedTargetingAt === null &&
              vanityTabCondition() === false &&
              isWorldCombatInProgress() === false,
            x: 249,
            y: 27,
          },
          height: 20,
          onClick: (): void => {
            inventoryWorldMenu.state.setValues({
              selectedBagItemIndex: null,
              tab: InventoryTab.Vanity,
            });
          },
          width: 34,
        }),
      );
      // Bag items
      for (let i: number = 0; i < bagItemsPerPage; i++) {
        const y: number = 49 + i * 18;
        hudElementReferences.push(
          createIconListItem({
            condition: (): boolean =>
              inventoryWorldMenu.state.values.startedTargetingAt === null &&
              inventoryWorldMenu.state.values.tab === InventoryTab.Bag &&
              i < worldState.values.bagItemInstanceIDs.length &&
              isWorldCombatInProgress() === false,
            icons: [
              {
                imagePath: (): string =>
                  getBagItemInstance(i).item.iconImagePath,
              },
            ],
            isSelected: (): boolean =>
              inventoryWorldMenu.state.values.selectedBagItemIndex === i,
            onClick: (): void => {
              if (inventoryWorldMenu.state.values.selectedBagItemIndex === i) {
                inventoryWorldMenu.state.setValues({
                  selectedBagItemIndex: null,
                });
              } else {
                inventoryWorldMenu.state.setValues({
                  selectedBagItemIndex: i,
                });
              }
            },
            slotImagePath: "slots/basic",
            text: (): CreateLabelOptionsText => ({
              value: getBagItemInstance(i).item.name,
            }),
            width: 116,
            x: 182,
            y,
          }),
        );
      }
      // Selected item display
      hudElementReferences.push(
        createSelectedItemDisplay({
          buttons: [
            {
              condition: (): boolean => {
                if (
                  inventoryWorldMenu.state.values.selectedBagItemIndex === null
                ) {
                  throw new Error("Selected bag item index is null");
                }
                const itemInstance: ItemInstance = getBagItemInstance(
                  inventoryWorldMenu.state.values.selectedBagItemIndex,
                );
                const item: Item = getDefinable(Item, itemInstance.itemID);
                return item.hasAbility() && item.ability.canBeUsedInWorld;
              },
              onClick: (): void => {
                if (
                  inventoryWorldMenu.state.values.selectedBagItemIndex === null
                ) {
                  throw new Error("Selected bag item index is null");
                }
                const itemInstance: ItemInstance = getBagItemInstance(
                  inventoryWorldMenu.state.values.selectedBagItemIndex,
                );
                switch (itemInstance.item.ability.targetType) {
                  case TargetType.AllAllies:
                    emitToSocketioServer<WorldUseItemInstanceRequest>({
                      data: {
                        itemInstanceID: itemInstance.id,
                      },
                      event: "world/use-item-instance",
                    });
                    inventoryWorldMenu.state.setValues({
                      isAwaitingWorldCombat: true,
                    });
                    break;
                  case TargetType.None:
                    emitToSocketioServer<WorldUseItemInstanceRequest>({
                      data: {
                        itemInstanceID: itemInstance.id,
                      },
                      event: "world/use-item-instance",
                    });
                    inventoryWorldMenu.state.setValues({
                      isAwaitingWorldCombat: true,
                    });
                    break;
                  case TargetType.Self:
                    emitToSocketioServer<WorldUseItemInstanceRequest>({
                      data: {
                        itemInstanceID: itemInstance.id,
                      },
                      event: "world/use-item-instance",
                    });
                    inventoryWorldMenu.state.setValues({
                      isAwaitingWorldCombat: true,
                    });
                    break;
                  case TargetType.SingleAlly:
                    inventoryWorldMenu.state.setValues({
                      startedTargetingAt: getCurrentTime(),
                    });
                    break;
                }
              },
              text: "Use",
              width: 34,
              x: 135,
            },
          ],
          condition: (): boolean =>
            inventoryWorldMenu.state.values.startedTargetingAt === null &&
            inventoryWorldMenu.state.values.selectedBagItemIndex !== null &&
            isWorldCombatInProgress() === false,
          itemID: (): string => {
            if (inventoryWorldMenu.state.values.selectedBagItemIndex === null) {
              throw new Error("Selected bag item index is null");
            }
            return getBagItemInstance(
              inventoryWorldMenu.state.values.selectedBagItemIndex,
            ).itemID;
          },
          onClose: (): void => {
            inventoryWorldMenu.state.setValues({
              selectedBagItemIndex: null,
            });
          },
        }),
      );
      // Targeting background panel
      hudElementReferences.push(
        createPanel({
          condition: (): boolean =>
            inventoryWorldMenu.state.values.startedTargetingAt !== null &&
            isWorldCombatInProgress() === false,
          height: 44,
          imagePath: "panels/basic",
          width: 147,
          x: 0,
          y: 164,
        }),
      );
      // Targeting ability icon
      hudElementReferences.push(
        createSlot({
          condition: (): boolean =>
            inventoryWorldMenu.state.values.startedTargetingAt !== null &&
            isWorldCombatInProgress() === false,
          icons: [
            {
              imagePath: (): string => {
                if (
                  inventoryWorldMenu.state.values.selectedBagItemIndex === null
                ) {
                  throw new Error("Selected bag item index is null");
                }
                const itemInstance: ItemInstance = getBagItemInstance(
                  inventoryWorldMenu.state.values.selectedBagItemIndex,
                );
                const item: Item = getDefinable(Item, itemInstance.itemID);
                return item.iconImagePath;
              },
            },
          ],
          imagePath: "slots/basic",
          x: 7,
          y: 171,
        }),
      );
      // Targeting ability name
      labelIDs.push(
        createLabel({
          color: Color.White,
          coordinates: {
            condition: (): boolean =>
              inventoryWorldMenu.state.values.startedTargetingAt !== null &&
              isWorldCombatInProgress() === false,
            x: 27,
            y: 176,
          },
          horizontalAlignment: "left",
          text: (): CreateLabelOptionsText => {
            if (inventoryWorldMenu.state.values.selectedBagItemIndex === null) {
              throw new Error("Selected bag item index is null");
            }
            const itemInstance: ItemInstance = getBagItemInstance(
              inventoryWorldMenu.state.values.selectedBagItemIndex,
            );
            const item: Item = getDefinable(Item, itemInstance.itemID);
            return {
              value: item.ability.name,
            };
          },
        }),
      );
      // Targeting close button
      hudElementReferences.push(
        createImage({
          condition: (): boolean =>
            inventoryWorldMenu.state.values.startedTargetingAt !== null &&
            isWorldCombatInProgress() === false,
          height: 11,
          imagePath: "x",
          onClick: (): void => {
            inventoryWorldMenu.state.setValues({
              startedTargetingAt: null,
            });
          },
          width: 10,
          x: 130,
          y: 171,
        }),
      );
      // Targeting instructions text
      labelIDs.push(
        createLabel({
          color: Color.White,
          coordinates: {
            condition: (): boolean =>
              inventoryWorldMenu.state.values.startedTargetingAt !== null &&
              isWorldCombatInProgress() === false,
            x: 74,
            y: 191,
          },
          horizontalAlignment: "center",
          maxLines: 1,
          maxWidth: 304,
          text: (): CreateLabelOptionsText => ({
            value: "Select a target.",
          }),
        }),
      );
      // Targeting keys
      [
        targetWorldPartyCharacter1InputCollectionID,
        targetWorldPartyCharacter2InputCollectionID,
        targetWorldPartyCharacter3InputCollectionID,
      ].forEach(
        (inputCollectionID: string, inputCollectionIndex: number): void => {
          inputPressHandlerIDs.push(
            createInputPressHandler({
              condition: (): boolean =>
                inventoryWorldMenu.state.values.startedTargetingAt !== null &&
                worldCharacter.party.worldCharacterIDs.length >
                  inputCollectionIndex &&
                isWorldCombatInProgress() === false,
              inputCollectionID,
              onInput: (): void => {
                if (
                  inventoryWorldMenu.state.values.selectedBagItemIndex === null
                ) {
                  throw new Error("Selected bag item index is null");
                }
                const itemInstance: ItemInstance = getBagItemInstance(
                  inventoryWorldMenu.state.values.selectedBagItemIndex,
                );
                const partyMemberWorldCharacter: WorldCharacter | undefined =
                  worldCharacter.party.worldCharacters[inputCollectionIndex];
                if (typeof partyMemberWorldCharacter === "undefined") {
                  throw new Error("No party member world character.");
                }
                emitToSocketioServer<WorldUseItemInstanceRequest>({
                  data: {
                    itemInstanceID: itemInstance.id,
                    playerID: partyMemberWorldCharacter.playerID,
                  },
                  event: "world/use-item-instance",
                });
                inventoryWorldMenu.state.setValues({
                  isAwaitingWorldCombat: true,
                });
              },
            }),
          );
        },
      );
      // X button
      hudElementReferences.push(
        createImage({
          condition: (): boolean =>
            inventoryWorldMenu.state.values.startedTargetingAt === null &&
            isWorldCombatInProgress() === false,
          height: 11,
          imagePath: "x",
          onClick: (): void => {
            inventoryWorldMenu.close();
          },
          width: 10,
          x: 287,
          y: 31,
        }),
      );
      // Gold
      labelIDs.push(
        createLabel({
          color: Color.LightYellow,
          coordinates: {
            condition: (): boolean =>
              inventoryWorldMenu.state.values.startedTargetingAt === null &&
              isWorldCombatInProgress() === false,
            x: 240,
            y: 193,
          },
          horizontalAlignment: "center",
          text: (): CreateLabelOptionsText => ({
            value: `${getFormattedInteger(worldState.values.inventoryGold)}g`,
          }),
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
      isAwaitingWorldCombat: false,
      selectedBagItemIndex: null,
      startedTargetingAt: null,
      tab: InventoryTab.Bag,
    },
    preventsWalking: false,
  },
);
