import {
  HUDElementReferences,
  Scriptable,
  createButton,
  createSprite,
} from "pixel-pigeon";

interface CreateClickableImageOptions {
  condition?: () => boolean;
  height: number;
  imagePath: Scriptable<string>;
  onClick: () => void;
  width: number;
  x: number;
  y: number;
}

export const createClickableImage = ({
  condition,
  height,
  imagePath,
  onClick,
  x,
  y,
  width,
}: CreateClickableImageOptions): HUDElementReferences => {
  const buttonIDs: string[] = [];
  const spriteIDs: string[] = [];
  spriteIDs.push(
    createSprite({
      animationID: "default",
      animations: [
        {
          frames: [
            {
              height,
              sourceHeight: height,
              sourceWidth: width,
              sourceX: 0,
              sourceY: 0,
              width,
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
      imagePath,
    }),
  );
  buttonIDs.push(
    createButton({
      coordinates: {
        condition,
        x,
        y,
      },
      height,
      onClick,
      width,
    }),
  );
  return {
    buttonIDs,
    spriteIDs,
  };
};
