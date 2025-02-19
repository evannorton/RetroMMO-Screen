import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  Scriptable,
  createLabel,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { Item } from "../../../classes/Item";
import { createImage } from "./createImage";
import { createPanel } from "./createPanel";
import { createPressableButton } from "./createPressableButton";
import { createSlot } from "./createSlot";
import { doesItemHaveVanity } from "../../doesItemHaveVanity";
import { getDefinable } from "definables";
import { getEquipmentPieceClassesText } from "../../getEquipmentPieceClassesText";
import { getEquipmentSlotName } from "../../getEquipmentSlotName";
import { getItemVanityClassesText } from "../../getItemVanityClassesText";
import { getItemVanitySlotText } from "../../getItemVanitySlotText";

interface CreateItemDisplayOptionsButton {
  readonly condition: () => boolean;
  readonly onClick: () => void;
  readonly text: string;
  readonly width: number;
  readonly x: number;
}

export interface CreateItemDisplayOptions {
  readonly buttons?: CreateItemDisplayOptionsButton[];
  readonly condition?: () => boolean;
  readonly itemID: Scriptable<string>;
  readonly onClose: () => void;
}
export const createSelectedItemDisplay = ({
  buttons,
  condition,
  itemID,
  onClose,
}: CreateItemDisplayOptions): HUDElementReferences => {
  const hudElementReferences: HUDElementReferences[] = [];
  const labelIDs: string[] = [];
  const getItem = (): Item =>
    getDefinable(Item, typeof itemID === "function" ? itemID() : itemID);
  // Selected bag item panel
  hudElementReferences.push(
    createPanel({
      condition,
      height: 76,
      imagePath: "panels/basic",
      width: 176,
      x: 0,
      y: 132,
    }),
  );
  // Selected bag item icon
  hudElementReferences.push(
    createSlot({
      condition,
      icons: [
        {
          imagePath: (): string => `item-icons/${getItem().id}`,
        },
      ],
      imagePath: "slots/basic",
      x: 7,
      y: 139,
    }),
  );
  // Selected bag item name
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition,
        x: 27,
        y: 144,
      },
      horizontalAlignment: "left",
      text: (): CreateLabelOptionsText => ({
        value: getItem().name,
      }),
    }),
  );
  // Selected bag item close button
  hudElementReferences.push(
    createImage({
      condition,
      height: 11,
      imagePath: "x",
      onClick: onClose,
      width: 10,
      x: 159,
      y: 139,
    }),
  );
  // Selected bag item description
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean => {
          if (typeof condition === "undefined" || condition()) {
            return getItem().hasDescription();
          }
          return false;
        },
        x: 8,
        y: 159,
      },
      horizontalAlignment: "left",
      maxLines: 3,
      maxWidth: 160,
      text: (): CreateLabelOptionsText => ({
        value: getItem().description,
      }),
    }),
  );
  // Selected bag item strength
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean => {
          if (typeof condition === "undefined" || condition()) {
            return getItem().hasEquipmentPiece();
          }
          return false;
        },
        x: 40,
        y: 161,
      },
      horizontalAlignment: "center",
      text: (): CreateLabelOptionsText => ({
        value: `${getItem().equipmentPiece.strength} STR`,
      }),
    }),
  );
  // Selected bag item intelligence
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean => {
          if (typeof condition === "undefined" || condition()) {
            return getItem().hasEquipmentPiece();
          }
          return false;
        },
        x: 88,
        y: 161,
      },
      horizontalAlignment: "center",
      text: (): CreateLabelOptionsText => ({
        value: `${getItem().equipmentPiece.intelligence} INT`,
      }),
    }),
  );
  // Selected bag item agility
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean => {
          if (typeof condition === "undefined" || condition()) {
            return getItem().hasEquipmentPiece();
          }
          return false;
        },
        x: 136,
        y: 161,
      },
      horizontalAlignment: "center",
      text: (): CreateLabelOptionsText => ({
        value: `${getItem().equipmentPiece.agility} AGI`,
      }),
    }),
  );
  // Selected bag item defense
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean => {
          if (typeof condition === "undefined" || condition()) {
            return getItem().hasEquipmentPiece();
          }
          return false;
        },
        x: 40,
        y: 172,
      },
      horizontalAlignment: "center",
      text: (): CreateLabelOptionsText => ({
        value: `${getItem().equipmentPiece.defense} DEF`,
      }),
    }),
  );
  // Selected bag item wisdom
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean => {
          if (typeof condition === "undefined" || condition()) {
            return getItem().hasEquipmentPiece();
          }
          return false;
        },
        x: 88,
        y: 172,
      },
      horizontalAlignment: "center",
      text: (): CreateLabelOptionsText => ({
        value: `${getItem().equipmentPiece.wisdom} WIS`,
      }),
    }),
  );
  // Selected bag item luck
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean => {
          if (typeof condition === "undefined" || condition()) {
            return getItem().hasEquipmentPiece();
          }
          return false;
        },
        x: 136,
        y: 172,
      },
      horizontalAlignment: "center",
      text: (): CreateLabelOptionsText => ({
        value: `${getItem().equipmentPiece.luck} LCK`,
      }),
    }),
  );
  // Selected bag item vanity slot
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean => {
          if (typeof condition === "undefined" || condition()) {
            return doesItemHaveVanity(getItem().id);
          }
          return false;
        },
        x: 7,
        y: 183,
      },
      horizontalAlignment: "left",
      text: (): CreateLabelOptionsText => ({
        value: getItemVanitySlotText(getItem().id),
      }),
    }),
  );
  // Selected bag item equipment slot
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean => {
          if (typeof condition === "undefined" || condition()) {
            return getItem().hasEquipmentPiece();
          }
          return false;
        },
        x: 7,
        y: 183,
      },
      horizontalAlignment: "left",
      text: (): CreateLabelOptionsText => ({
        value: getEquipmentSlotName(getItem().equipmentPiece.slot),
      }),
    }),
  );
  // Selected bag item vanity requirements
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean => {
          if (typeof condition === "undefined" || condition()) {
            return doesItemHaveVanity(getItem().id);
          }
          return false;
        },
        x: 7,
        y: 194,
      },
      horizontalAlignment: "left",
      text: (): CreateLabelOptionsText => ({
        value: getItemVanityClassesText(getItem().id),
      }),
    }),
  );
  // Selected bag item equipment requirements
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean => {
          if (typeof condition === "undefined" || condition()) {
            const item: Item = getDefinable(Item, getItem().id);
            return item.hasEquipmentPiece();
          }
          return false;
        },
        x: 7,
        y: 194,
      },
      horizontalAlignment: "left",
      text: (): CreateLabelOptionsText => ({
        value: getEquipmentPieceClassesText(getItem().equipmentPieceID),
      }),
    }),
  );
  // Buttons
  if (typeof buttons !== "undefined") {
    for (const button of buttons) {
      hudElementReferences.push(
        createPressableButton({
          condition: (): boolean => {
            if (typeof condition === "undefined" || condition()) {
              return button.condition();
            }
            return false;
          },
          height: 16,
          imagePath: "pressable-buttons/gray",
          onClick: button.onClick,
          text: { value: button.text },
          width: button.width,
          x: button.x,
          y: 185,
        }),
      );
    }
  }
  return mergeHUDElementReferences([
    {
      labelIDs,
    },
    ...hudElementReferences,
  ]);
};
