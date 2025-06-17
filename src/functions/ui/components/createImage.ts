import {
  CreateSpriteOptionsRecolor,
  HUDElementReferences,
  Scriptable,
  createButton,
  createSprite,
} from "pixel-pigeon";

export interface CreateImageOptions {
  readonly condition?: () => boolean;
  readonly height: number;
  readonly imagePath: Scriptable<string>;
  readonly onClick?: () => void;
  readonly palette?: Scriptable<string[]>;
  readonly recolors?: Scriptable<CreateSpriteOptionsRecolor[]>;
  readonly width: number;
  readonly x: Scriptable<number>;
  readonly y: Scriptable<number>;
}
export const createImage = ({
  condition,
  height,
  imagePath,
  onClick,
  palette,
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
      palette,
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
