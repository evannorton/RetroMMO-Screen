import {
  Scriptable,
  createButton,
  createInputPressHandler,
  createSprite,
} from "pixel-pigeon";
import { pianoWorldMenu } from "../../../world-menus/pianoWorldMenu";

export interface CreateBottomBarIconOptions {
  condition?: () => boolean;
  imagePath: string;
  inputCollectionID: string;
  isSelected: Scriptable<boolean>;
  onClick: () => void;
  x: number;
  y: number;
}
export const createBottomBarIcon = ({
  condition,
  imagePath,
  inputCollectionID,
  isSelected,
  onClick,
  x,
  y,
}: CreateBottomBarIconOptions): void => {
  createSprite({
    animationID: (): string => {
      const isSelectedValue: boolean =
        typeof isSelected === "function" ? isSelected() : isSelected;
      return isSelectedValue ? "selected" : "unselected";
    },
    animations: [
      {
        frames: [
          {
            height: 22,
            sourceHeight: 22,
            sourceWidth: 22,
            sourceX: 0,
            sourceY: 0,
            width: 22,
          },
        ],
        id: "unselected",
      },
      {
        frames: [
          {
            height: 22,
            sourceHeight: 22,
            sourceWidth: 22,
            sourceX: 22,
            sourceY: 0,
            width: 22,
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
  });
  createButton({
    coordinates: {
      condition,
      x: x - 1,
      y: y - 1,
    },
    height: 22,
    onClick,
    width: 22,
  });
  createInputPressHandler({
    condition: (): boolean => {
      if (typeof condition === "undefined" || condition()) {
        return pianoWorldMenu.isOpen() === false;
      }
      return false;
    },
    inputCollectionID,
    onInput: onClick,
  });
};
