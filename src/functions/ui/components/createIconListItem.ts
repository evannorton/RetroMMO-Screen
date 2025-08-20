import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  Scriptable,
  createButton,
  createLabel,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { CreateSlotOptionsIcon, createSlot } from "./createSlot";

interface CreateIconListItemOptions {
  readonly condition?: () => boolean;
  readonly icons: CreateSlotOptionsIcon[];
  readonly isSelected?: Scriptable<boolean>;
  readonly onClick: () => void;
  readonly slotImagePath: string;
  readonly text: Scriptable<CreateLabelOptionsText>;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export const createIconListItem = ({
  condition,
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
      condition,
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
        condition,
        x: x + 20,
        y: y + 5,
      },
      horizontalAlignment: "left",
      maxLines: 1,
      maxWidth: width - 18,
      size: 1,
      text,
    }),
  );
  buttonIDs.push(
    createButton({
      coordinates: {
        condition,
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
