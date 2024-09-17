import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  Scriptable,
  createLabel,
  createQuadrilateral,
  createSprite,
} from "pixel-pigeon";

export interface CreateResourceBarOptions {
  condition?: () => boolean;
  iconImagePath: string;
  maxValue: Scriptable<number>;
  primaryColor: string;
  secondaryColor: string;
  value: Scriptable<number>;
  x: Scriptable<number>;
  y: Scriptable<number>;
}
export const createResourceBar = ({
  condition,
  iconImagePath,
  maxValue,
  primaryColor,
  secondaryColor,
  value,
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
  const maxFillingWidth: number = 38;
  const fillingWidth = (): number => {
    const calculatedValue: number = typeof value === "number" ? value : value();
    const calculatedMaxValue: number =
      typeof maxValue === "number" ? maxValue : maxValue();
    const percentageWidth: number = Math.ceil(
      (maxFillingWidth * calculatedValue) / calculatedMaxValue,
    );
    const maxed: boolean = calculatedValue === calculatedMaxValue;
    const minned: boolean = calculatedValue === 0;
    return maxed === false && percentageWidth === maxFillingWidth
      ? percentageWidth - 1
      : minned === false && percentageWidth === 0
        ? percentageWidth + 1
        : percentageWidth;
  };
  createQuadrilateral({
    color: primaryColor,
    coordinates: {
      condition,
      x: (typeof x === "number" ? x : x()) + 3,
      y: (typeof y === "number" ? y : y()) + 5,
    },
    height: 2,
    width: fillingWidth,
  });
  createQuadrilateral({
    color: secondaryColor,
    coordinates: {
      condition,
      x: (): number => (typeof x === "number" ? x : x()) + 3,
      y: (): number => (typeof y === "number" ? y : y()) + 7,
    },
    height: 1,
    width: fillingWidth,
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
  createLabel({
    color: Color.White,
    coordinates: {
      condition,
      x: (typeof x === "number" ? x : x()) + 37,
      y,
    },
    horizontalAlignment: "right",
    text: (): CreateLabelOptionsText => ({
      value: String(typeof value === "number" ? value : value()),
    }),
  });
};
