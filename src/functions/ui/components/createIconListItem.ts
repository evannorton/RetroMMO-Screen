import { Color } from "retrommo-types";
import { CreateSlotOptionsIcon, createSlot } from "./createSlot";
import {
  HUDElementReferences,
  Scriptable,
  createButton,
  createLabel,
  mergeHUDElementReferences,
} from "pixel-pigeon";

interface CreateIconListItemOptions {
  icons: CreateSlotOptionsIcon[];
  isSelected: Scriptable<boolean>;
  onClick: () => void;
  slotImagePath: string;
  text: string;
  width: number;
  x: number;
  y: number;
}

export const createIconListItem = ({
  icons,
  isSelected,
  onClick,
  slotImagePath,
  text,
  width,
  x,
  y,
}: CreateIconListItemOptions): HUDElementReferences => {
  const hudElementReferences: HUDElementReferences[] = [];
  const buttonIDs: string[] = [];
  const labelIDs: string[] = [];
  hudElementReferences.push(
    createSlot({
      icons,
      imagePath: slotImagePath,
      isSelected,
      x,
      y,
    }),
  );
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        x: x + 19,
        y: y + 5,
      },
      horizontalAlignment: "left",
      maxLines: 1,
      maxWidth: width - 19,
      size: 1,
      text: {
        value: text,
      },
    }),
  );
  buttonIDs.push(
    createButton({
      coordinates: {
        x,
        y,
      },
      height: 16,
      onClick,
      width,
    }),
  );
  return mergeHUDElementReferences([
    {
      buttonIDs,
      labelIDs,
    },
    ...hudElementReferences,
  ]);
};
