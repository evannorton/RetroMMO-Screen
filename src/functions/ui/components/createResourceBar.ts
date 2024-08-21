import { Scriptable, createSprite } from "pixel-pigeon";

export interface CreateResourceBarOptions {
  condition?: () => boolean;
  iconImagePath: string;
  maxValue: number;
  primaryColor: string;
  secondaryColor: string;
  value: number;
  x: Scriptable<number>;
  y: Scriptable<number>;
}
export const createResourceBar = ({
  condition,
  iconImagePath,
  x,
  y,
}: CreateResourceBarOptions): void => {
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: 8,
            sourceHeight: 8,
            sourceWidth: 41,
            sourceX: 0,
            sourceY: 0,
            width: 41,
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
    imagePath: "calipers",
  });
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: 7,
            sourceHeight: 7,
            sourceWidth: 7,
            sourceX: 0,
            sourceY: 0,
            width: 7,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: (typeof x === "number" ? x : x()) + 4,
      y,
    },
    imagePath: iconImagePath,
  });
};
