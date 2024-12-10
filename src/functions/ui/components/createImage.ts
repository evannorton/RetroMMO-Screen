import {
  CreateSpriteOptionsRecolor,
  HUDElementReferences,
  Scriptable,
  createButton,
  createSprite,
} from "pixel-pigeon";

export interface CreateImageOptions {
  condition?: () => boolean;
  height: number;
  imagePath: Scriptable<string>;
  onClick?: () => void;
  recolors?: Scriptable<CreateSpriteOptionsRecolor[]>;
  width: number;
  x: Scriptable<number>;
  y: Scriptable<number>;
}
export const createImage = ({
  condition,
  height,
  imagePath,
  onClick,
  recolors,
  x,
  y,
  width,
}: CreateImageOptions): HUDElementReferences => {
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
      recolors,
    }),
  );
  if (typeof onClick !== "undefined") {
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
  }
  return {
    buttonIDs,
    spriteIDs,
  };
};
