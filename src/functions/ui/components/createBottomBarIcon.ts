import { createImage } from "./createImage";
import { createInputPressHandler } from "pixel-pigeon";
import { pianoWorldMenu } from "../../../world-menus/pianoWorldMenu";

export interface CreateBottomBarIconOptions {
  condition?: () => boolean;
  inputCollectionID: string;
  legacyOpen: () => void;
  selectedImagePath: string;
  unselectedImagePath: string;
  x: number;
  y: number;
}
export const createBottomBarIcon = ({
  condition,
  inputCollectionID,
  legacyOpen,
  unselectedImagePath,
  x,
  y,
}: CreateBottomBarIconOptions): void => {
  createImage({
    condition,
    height: 20,
    imagePath: unselectedImagePath,
    onClick: legacyOpen,
    width: 20,
    x,
    y,
  });
  createInputPressHandler({
    condition: (): boolean => {
      if (typeof condition === "undefined" || condition()) {
        return pianoWorldMenu.isOpen() === false;
      }
      return false;
    },
    inputCollectionID,
    onInput: legacyOpen,
  });
};
