import {
  CreateSpriteOptionsRecolor,
  HUDElementReferences,
  Scriptable,
  createSprite,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { createImage } from "./createImage";

export interface CreateSlotOptionsIcon {
  condition?: () => boolean;
  imagePath: Scriptable<string>;
  recolors?: Scriptable<CreateSpriteOptionsRecolor[]>;
}
export interface CreateSlotOptions {
  condition?: () => boolean;
  icons?: CreateSlotOptionsIcon[];
  imagePath: string;
  isSelected?: Scriptable<boolean>;
  x: number;
  y: number;
}
export const createSlot = ({
  condition,
  icons,
  imagePath,
  isSelected,
  x,
  y,
}: CreateSlotOptions): HUDElementReferences => {
  const hudElementReferences: HUDElementReferences[] = [];
  const spriteIDs: string[] = [];
  spriteIDs.push(
    createSprite({
      animationID: (): string => {
        const isSelectedResult: boolean | undefined =
          typeof isSelected === "function" ? isSelected() : isSelected;
        return isSelectedResult === true ? "selected" : "default";
      },
      animations: [
        {
          frames: [
            {
              height: 18,
              sourceHeight: 18,
              sourceWidth: 18,
              sourceX: 0,
              sourceY: 0,
              width: 18,
            },
          ],
          id: "default",
        },
        {
          frames: [
            {
              height: 18,
              sourceHeight: 18,
              sourceWidth: 18,
              sourceX: 18,
              sourceY: 0,
              width: 18,
            },
          ],
          id: "selected",
        },
      ],
      coordinates: {
        condition,
        x: x - 1,
        y: y - 1,
      },
      imagePath,
    }),
  );
  if (typeof icons !== "undefined") {
    for (const icon of icons) {
      hudElementReferences.push(
        createImage({
          condition: (): boolean =>
            (typeof condition === "undefined" || condition()) &&
            (typeof icon.condition === "undefined" || icon.condition()),
          height: 16,
          imagePath: icon.imagePath,
          recolors: icon.recolors,
          width: 16,
          x,
          y,
        }),
      );
    }
  }
  return mergeHUDElementReferences([
    {
      spriteIDs,
    },
    ...hudElementReferences,
  ]);
};
