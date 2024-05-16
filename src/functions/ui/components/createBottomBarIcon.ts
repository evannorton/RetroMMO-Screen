import {
  createButton,
  createInputPressHandler,
  createSprite,
} from "pixel-pigeon";

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
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: 20,
            sourceHeight: 20,
            sourceWidth: 20,
            sourceX: 0,
            sourceY: 0,
            width: 20,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x,
      y,
    },
    imagePath: unselectedImagePath,
  });
  createButton({
    coordinates: {
      condition,
      x,
      y,
    },
    height: 20,
    onClick: legacyOpen,
    width: 20,
  });
  createInputPressHandler({
    condition,
    inputCollectionID,
    onInput: legacyOpen,
  });
};
