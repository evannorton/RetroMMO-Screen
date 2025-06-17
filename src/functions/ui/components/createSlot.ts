import {
  CreateSpriteOptionsRecolor,
  HUDElementReferences,
  Scriptable,
  createButton,
  createSprite,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { createImage } from "./createImage";

export interface CreateSlotOptionsIcon {
  readonly condition?: () => boolean;
  readonly imagePath: Scriptable<string>;
  readonly palette?: Scriptable<string[]>;
  readonly recolors?: Scriptable<CreateSpriteOptionsRecolor[]>;
}
export interface CreateSlotOptions {
  readonly condition?: () => boolean;
  readonly icons?: CreateSlotOptionsIcon[];
  readonly imagePath: Scriptable<string>;
  readonly isSelected?: Scriptable<boolean>;
  readonly button?: {
    readonly condition?: () => boolean;
    readonly onClick: () => void;
  };
  readonly x: number;
  readonly y: number;
}
export const createSlot = ({
  button,
  condition,
  icons,
  imagePath,
  isSelected,
  x,
  y,
}: CreateSlotOptions): HUDElementReferences => {
  const hudElementReferences: HUDElementReferences[] = [];
  const buttonIDs: string[] = [];
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
  if (typeof button !== "undefined") {
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: button.condition,
          x,
          y,
        },
        height: 16,
        onClick: button.onClick,
        width: 16,
      }),
    );
  }
  if (typeof icons !== "undefined") {
    for (const icon of icons) {
      hudElementReferences.push(
        createImage({
          condition: (): boolean =>
            (typeof condition === "undefined" || condition()) &&
            (typeof icon.condition === "undefined" || icon.condition()),
          height: 16,
          imagePath: icon.imagePath,
          palette: icon.palette,
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
      buttonIDs,
      spriteIDs,
    },
    ...hudElementReferences,
  ]);
};
