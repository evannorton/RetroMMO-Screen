import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  Scriptable,
  createLabel,
  createQuadrilateral,
} from "pixel-pigeon";
import { createImage } from "./createImage";

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
  createImage({
    condition,
    height: 8,
    imagePath: "calipers",
    width: 41,
    x,
    y,
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
  createImage({
    condition,
    height: 7,
    imagePath: iconImagePath,
    width: 7,
    x: (typeof x === "number" ? x : x()) + 4,
    y,
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
