import {
  Color,
  EquipmentSlot,
  TargetType,
  VanitySlot,
  WorldEquipEquipmentItemRequest,
  WorldEquipVanityItemRequest,
  WorldUnequipEquipmentItemRequest,
  WorldUnequipVanityItemRequest,
  WorldUseItemInstanceRequest,
} from "retrommo-types";
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
import { createItemDisplay } from "../functions/ui/components/createItemDisplay";
import { createPanel } from "../functions/ui/components/createPanel";
import { createSlot } from "../functions/ui/components/createSlot";
import { doesItemHaveVanity } from "../functions/doesItemHaveVanity";
import { getConstants } from "../functions/getConstants";
import { getDefinable } from "definables";
import { getFormattedInteger } from "../functions/getFormattedInteger";
import { getItemVanityClassIDs } from "../functions/getItemVanityClassIDs";
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
const getEquipmentItemInstance = (
  equipmentSlot: EquipmentSlot,
): ItemInstance => {
  const worldState: State<WorldStateSchema> = getWorldState();
  switch (equipmentSlot) {
    case EquipmentSlot.Head:
      if (worldState.values.headItemInstanceID === null) {
        throw new Error("Head item instance ID is null");
      }
      return getDefinable(ItemInstance, worldState.values.headItemInstanceID);
    case EquipmentSlot.Body:
      if (worldState.values.bodyItemInstanceID === null) {
        throw new Error("Body item instance ID is null");
      }
      return getDefinable(ItemInstance, worldState.values.bodyItemInstanceID);
    case EquipmentSlot.MainHand:
      if (worldState.values.mainHandItemInstanceID === null) {
        throw new Error("Main hand item instance ID is null");
      }
      return getDefinable(
        ItemInstance,
        worldState.values.mainHandItemInstanceID,
      );
    case EquipmentSlot.OffHand:
      if (worldState.values.offHandItemInstanceID === null) {
        throw new Error("Off hand item instance ID is null");
      }
      return getDefinable(
        ItemInstance,
        worldState.values.offHandItemInstanceID,
      );
  }
};
const hasEquipmentItemInstance = (equipmentSlot: EquipmentSlot): boolean => {
  const worldState: State<WorldStateSchema> = getWorldState();
  switch (equipmentSlot) {
    case EquipmentSlot.Head:
      return worldState.values.headItemInstanceID !== null;
    case EquipmentSlot.Body:
      return worldState.values.bodyItemInstanceID !== null;
    case EquipmentSlot.MainHand:
      return worldState.values.mainHandItemInstanceID !== null;
    case EquipmentSlot.OffHand:
      return worldState.values.offHandItemInstanceID !== null;
  }
};
const getVanityItemInstance = (vanitySlot: VanitySlot): ItemInstance => {
  const worldState: State<WorldStateSchema> = getWorldState();
  switch (vanitySlot) {
    case VanitySlot.ClothesDye:
      if (worldState.values.clothesDyeItemInstanceID === null) {
        throw new Error("ClothesDye item instance ID is null");
      }
      return getDefinable(
        ItemInstance,
        worldState.values.clothesDyeItemInstanceID,
      );
    case VanitySlot.HairDye:
      if (worldState.values.hairDyeItemInstanceID === null) {
        throw new Error("HairDye item instance ID is null");
      }
      return getDefinable(
        ItemInstance,
        worldState.values.hairDyeItemInstanceID,
      );
    case VanitySlot.Mask:
      if (worldState.values.maskItemInstanceID === null) {
        throw new Error("Mask item instance ID is null");
      }
      return getDefinable(ItemInstance, worldState.values.maskItemInstanceID);
    case VanitySlot.Outfit:
      if (worldState.values.outfitItemInstanceID === null) {
        throw new Error("Outfit item instance ID is null");
      }
      return getDefinable(ItemInstance, worldState.values.outfitItemInstanceID);
  }
};
const hasVanityItemInstance = (vanitySlot: VanitySlot): boolean => {
  const worldState: State<WorldStateSchema> = getWorldState();
  switch (vanitySlot) {
    case VanitySlot.ClothesDye:
      return worldState.values.clothesDyeItemInstanceID !== null;
    case VanitySlot.HairDye:
      return worldState.values.hairDyeItemInstanceID !== null;
    case VanitySlot.Mask:
      return worldState.values.maskItemInstanceID !== null;
    case VanitySlot.Outfit:
      return worldState.values.outfitItemInstanceID !== null;
  }
};

export interface InventoryWorldMenuOpenOptions {}
export interface InventoryWorldMenuStateSchema {
  isAwaitingWorldCombat: boolean;
  selectedBagItemIndex: number | null;
  selectedEquipmentSlot: EquipmentSlot | null;
  selectedVanitySlot: VanitySlot | null;
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
              selectedEquipmentSlot: null,
              selectedVanitySlot: null,
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
              selectedVanitySlot: null,
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
              selectedEquipmentSlot: null,
              tab: InventoryTab.Vanity,
            });
          },
          width: 34,
        }),
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
      // Selected bag item display
      hudElementReferences.push(
        createItemDisplay({
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
                return (
                  itemInstance.item.hasEquipmentPiece() &&
                  worldCharacter.player.character.level >=
                    itemInstance.item.equipmentPiece.level &&
                  itemInstance.item.equipmentPiece.classIDs.includes(
                    worldCharacter.player.character.classID,
                  )
                );
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
                emitToSocketioServer<WorldEquipEquipmentItemRequest>({
                  data: {
                    itemInstanceID: itemInstance.id,
                  },
                  event: "world/equip-equipment-item",
                });
              },
              text: "Equip",
              width: 46,
              x: 123,
            },
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
                return (
                  doesItemHaveVanity(itemInstance.itemID) &&
                  getItemVanityClassIDs(itemInstance.itemID).includes(
                    worldCharacter.player.character.classID,
                  )
                );
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
                emitToSocketioServer<WorldEquipVanityItemRequest>({
                  data: {
                    itemInstanceID: itemInstance.id,
                  },
                  event: "world/equip-vanity-item",
                });
              },
              text: "Equip",
              width: 46,
              x: 123,
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
                worldCharacter.player.character.party.playerIDs.length >
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
                const partyMemberPlayerID: string | undefined =
                  worldCharacter.player.character.party.playerIDs[inputCollectionIndex];
                if (typeof partyMemberPlayerID === "undefined") {
                  throw new Error("No party member player.");
                }
                emitToSocketioServer<WorldUseItemInstanceRequest>({
                  data: {
                    itemInstanceID: itemInstance.id,
                    playerID: partyMemberPlayerID,
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
      // Equipment items
      [
        EquipmentSlot.Head,
        EquipmentSlot.Body,
        EquipmentSlot.MainHand,
        EquipmentSlot.OffHand,
      ].forEach(
        (equipmentSlot: EquipmentSlot, equipmentSlotIndex: number): void => {
          labelIDs.push(
            createLabel({
              color: Color.White,
              coordinates: {
                condition: (): boolean =>
                  inventoryWorldMenu.state.values.startedTargetingAt === null &&
                  inventoryWorldMenu.state.values.tab ===
                    InventoryTab.Equipment &&
                  isWorldCombatInProgress() === false,
                x: 183,
                y: 54 + equipmentSlotIndex * 36,
              },
              horizontalAlignment: "left",
              text: (): CreateLabelOptionsText => {
                switch (equipmentSlot) {
                  case EquipmentSlot.Head:
                    return { value: "Head" };
                  case EquipmentSlot.Body:
                    return { value: "Body" };
                  case EquipmentSlot.MainHand:
                    return { value: "Main Hand" };
                  case EquipmentSlot.OffHand:
                    return { value: "Off Hand" };
                }
                throw new Error("Invalid equipment slot index");
              },
            }),
          );
          hudElementReferences.push(
            createIconListItem({
              condition: (): boolean =>
                inventoryWorldMenu.state.values.startedTargetingAt === null &&
                inventoryWorldMenu.state.values.tab ===
                  InventoryTab.Equipment &&
                hasEquipmentItemInstance(equipmentSlot) &&
                isWorldCombatInProgress() === false,
              icons: [
                {
                  imagePath: (): string =>
                    getEquipmentItemInstance(equipmentSlot).item.iconImagePath,
                },
              ],
              isSelected: (): boolean =>
                inventoryWorldMenu.state.values.selectedEquipmentSlot ===
                equipmentSlot,
              onClick: (): void => {
                if (
                  inventoryWorldMenu.state.values.selectedEquipmentSlot ===
                  equipmentSlot
                ) {
                  inventoryWorldMenu.state.setValues({
                    selectedEquipmentSlot: null,
                  });
                } else {
                  inventoryWorldMenu.state.setValues({
                    selectedEquipmentSlot: equipmentSlot,
                  });
                }
              },
              slotImagePath: "slots/basic",
              text: (): CreateLabelOptionsText => ({
                value: getEquipmentItemInstance(equipmentSlot).item.name,
              }),
              width: 116,
              x: 182,
              y: 67 + equipmentSlotIndex * 36,
            }),
          );
        },
      );
      // Selected equipment item display
      hudElementReferences.push(
        createItemDisplay({
          buttons: [
            {
              condition: (): boolean =>
                worldState.values.bagItemInstanceIDs.length <
                getConstants()["maximum-bag-items"],
              onClick: (): void => {
                if (
                  inventoryWorldMenu.state.values.selectedEquipmentSlot === null
                ) {
                  throw new Error("Selected equipment slot is null");
                }
                const itemInstance: ItemInstance = getEquipmentItemInstance(
                  inventoryWorldMenu.state.values.selectedEquipmentSlot,
                );
                emitToSocketioServer<WorldUnequipEquipmentItemRequest>({
                  data: {
                    itemInstanceID: itemInstance.id,
                  },
                  event: "world/unequip-equipment-item",
                });
              },
              text: "Unequip",
              width: 58,
              x: 111,
            },
          ],
          condition: (): boolean =>
            inventoryWorldMenu.state.values.startedTargetingAt === null &&
            inventoryWorldMenu.state.values.selectedEquipmentSlot !== null &&
            isWorldCombatInProgress() === false,
          itemID: (): string => {
            if (
              inventoryWorldMenu.state.values.selectedEquipmentSlot === null
            ) {
              throw new Error("Selected equipment slot is null");
            }
            return getEquipmentItemInstance(
              inventoryWorldMenu.state.values.selectedEquipmentSlot,
            ).itemID;
          },
          onClose: (): void => {
            inventoryWorldMenu.state.setValues({
              selectedEquipmentSlot: null,
            });
          },
        }),
      );
      // Vanity items
      [
        VanitySlot.Mask,
        VanitySlot.Outfit,
        VanitySlot.HairDye,
        VanitySlot.ClothesDye,
      ].forEach((vanitySlot: VanitySlot, vanitySlotIndex: number): void => {
        labelIDs.push(
          createLabel({
            color: Color.White,
            coordinates: {
              condition: (): boolean =>
                inventoryWorldMenu.state.values.startedTargetingAt === null &&
                inventoryWorldMenu.state.values.tab === InventoryTab.Vanity &&
                isWorldCombatInProgress() === false,
              x: 183,
              y: 54 + vanitySlotIndex * 36,
            },
            horizontalAlignment: "left",
            text: (): CreateLabelOptionsText => {
              switch (vanitySlot) {
                case VanitySlot.Mask:
                  return { value: "Mask" };
                case VanitySlot.Outfit:
                  return { value: "Outfit" };
                case VanitySlot.HairDye:
                  return { value: "Hair Dye" };
                case VanitySlot.ClothesDye:
                  return { value: "Clothes Dye" };
              }
              throw new Error("Invalid vanity slot index");
            },
          }),
        );
        hudElementReferences.push(
          createIconListItem({
            condition: (): boolean =>
              inventoryWorldMenu.state.values.startedTargetingAt === null &&
              inventoryWorldMenu.state.values.tab === InventoryTab.Vanity &&
              hasVanityItemInstance(vanitySlot) &&
              isWorldCombatInProgress() === false,
            icons: [
              {
                imagePath: (): string =>
                  getVanityItemInstance(vanitySlot).item.iconImagePath,
              },
            ],
            isSelected: (): boolean =>
              inventoryWorldMenu.state.values.selectedVanitySlot === vanitySlot,
            onClick: (): void => {
              if (
                inventoryWorldMenu.state.values.selectedVanitySlot ===
                vanitySlot
              ) {
                inventoryWorldMenu.state.setValues({
                  selectedVanitySlot: null,
                });
              } else {
                inventoryWorldMenu.state.setValues({
                  selectedVanitySlot: vanitySlot,
                });
              }
            },
            slotImagePath: "slots/basic",
            text: (): CreateLabelOptionsText => ({
              value: getVanityItemInstance(vanitySlot).item.name,
            }),
            width: 116,
            x: 182,
            y: 67 + vanitySlotIndex * 36,
          }),
        );
      });
      // Selected vanity item display
      hudElementReferences.push(
        createItemDisplay({
          buttons: [
            {
              condition: (): boolean =>
                worldState.values.bagItemInstanceIDs.length <
                getConstants()["maximum-bag-items"],
              onClick: (): void => {
                if (
                  inventoryWorldMenu.state.values.selectedVanitySlot === null
                ) {
                  throw new Error("Selected vanity slot is null");
                }
                const itemInstance: ItemInstance = getVanityItemInstance(
                  inventoryWorldMenu.state.values.selectedVanitySlot,
                );
                emitToSocketioServer<WorldUnequipVanityItemRequest>({
                  data: {
                    itemInstanceID: itemInstance.id,
                  },
                  event: "world/unequip-vanity-item",
                });
              },
              text: "Unequip",
              width: 58,
              x: 111,
            },
          ],
          condition: (): boolean =>
            inventoryWorldMenu.state.values.startedTargetingAt === null &&
            inventoryWorldMenu.state.values.selectedVanitySlot !== null &&
            isWorldCombatInProgress() === false,
          itemID: (): string => {
            if (inventoryWorldMenu.state.values.selectedVanitySlot === null) {
              throw new Error("Selected vanity slot is null");
            }
            return getVanityItemInstance(
              inventoryWorldMenu.state.values.selectedVanitySlot,
            ).itemID;
          },
          onClose: (): void => {
            inventoryWorldMenu.state.setValues({
              selectedVanitySlot: null,
            });
          },
        }),
      );
      return mergeHUDElementReferences([
        {
          buttonIDs,
          inputPressHandlerIDs,
          labelIDs,
          spriteIDs,
        },
        ...hudElementReferences,
      ]);
    },
    initialStateValues: {
      isAwaitingWorldCombat: false,
      selectedBagItemIndex: null,
      selectedEquipmentSlot: null,
      selectedVanitySlot: null,
      startedTargetingAt: null,
      tab: InventoryTab.Bag,
    },
    preventsWalking: false,
  },
);
