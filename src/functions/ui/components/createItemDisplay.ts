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
import { getEquipmentPieceRequirementsText } from "../../getEquipmentPieceRequirementsText";
import { getEquipmentSlotName } from "../../getEquipmentSlotName";
import { getFormattedInteger } from "../../getFormattedInteger";
import { getItemVanityRequirementsText } from "../../getItemVanityRequirementsText";
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
  readonly gold?: Scriptable<number>;
  readonly itemID: Scriptable<string>;
  readonly onClose: () => void;
}
export const createItemDisplay = ({
  buttons,
  condition,
  gold,
  itemID,
  onClose,
}: CreateItemDisplayOptions): HUDElementReferences => {
  const hudElementReferences: HUDElementReferences[] = [];
  const labelIDs: string[] = [];
  const getItem = (): Item =>
    getDefinable(Item, typeof itemID === "function" ? itemID() : itemID);
  // Panel
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
  // Icon
  hudElementReferences.push(
    createSlot({
      condition,
      icons: [
        {
          imagePath: (): string => getItem().iconImagePath,
        },
      ],
      imagePath: "slots/basic",
      x: 7,
      y: 139,
    }),
  );
  // Name
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
  // Close button
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
  // Description
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
  // Strength
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
  // Intelligence
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
  // Agility
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
  // Defense
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
  // Wisdom
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
  // Luck
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
  // Vanity slot
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
  // Equipment slot
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
  // Vanity requirements
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
        value: getItemVanityRequirementsText(getItem().id),
      }),
    }),
  );
  // Equipment requirements
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
        value: getEquipmentPieceRequirementsText(getItem().equipmentPieceID),
      }),
    }),
  );
  if (typeof gold !== "undefined") {
    if (typeof buttons === "undefined" || buttons.length === 0) {
      throw new Error("goldLabel.x is undefined and buttons are undefined");
    }
    let leftMostButtonX: number | undefined;
    for (const button of buttons) {
      if (
        typeof leftMostButtonX === "undefined" ||
        button.x < leftMostButtonX
      ) {
        leftMostButtonX = button.x;
      }
    }
    if (typeof leftMostButtonX === "undefined") {
      throw new Error("Buttons array is empty");
    }
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition,
          x: leftMostButtonX - 4,
          y: 186,
        },
        horizontalAlignment: "right",
        maxLines: 1,
        maxWidth: 304,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: `${getFormattedInteger(
            typeof gold === "function" ? gold() : gold,
          )}g`,
        }),
      }),
    );
  }
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
