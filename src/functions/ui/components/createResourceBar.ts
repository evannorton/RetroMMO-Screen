import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  Scriptable,
  createLabel,
  createQuadrilateral,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { createImage } from "./createImage";
import { getFormattedInteger } from "../../getFormattedInteger";

export interface CreateResourceBarOptions {
  readonly condition?: () => boolean;
  readonly iconImagePath: string;
  readonly maxValue: Scriptable<number>;
  readonly primaryColor: string;
  readonly secondaryColor: string;
  readonly value: Scriptable<number>;
  readonly x: Scriptable<number>;
  readonly y: Scriptable<number>;
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
}: CreateResourceBarOptions): HUDElementReferences => {
  const labelIDs: string[] = [];
  const quadrilateralIDs: string[] = [];
  const hudElementReferences: HUDElementReferences[] = [];
  hudElementReferences.push(
    createImage({
      condition,
      height: 8,
      imagePath: "calipers",
      width: 41,
      x,
      y,
    }),
  );
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
  quadrilateralIDs.push(
    createQuadrilateral({
      color: primaryColor,
      coordinates: {
        condition,
        x: (typeof x === "number" ? x : x()) + 3,
        y: (typeof y === "number" ? y : y()) + 5,
      },
      height: 2,
      width: fillingWidth,
    }),
  );
  quadrilateralIDs.push(
    createQuadrilateral({
      color: secondaryColor,
      coordinates: {
        condition,
        x: (): number => (typeof x === "number" ? x : x()) + 3,
        y: (): number => (typeof y === "number" ? y : y()) + 7,
      },
      height: 1,
      width: fillingWidth,
    }),
  );
  hudElementReferences.push(
    createImage({
      condition,
      height: 7,
      imagePath: iconImagePath,
      width: 7,
      x: (typeof x === "number" ? x : x()) + 4,
      y,
    }),
  );
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition,
        x: (typeof x === "number" ? x : x()) + 37,
        y,
      },
      horizontalAlignment: "right",
      text: (): CreateLabelOptionsText => ({
        value: getFormattedInteger(typeof value === "number" ? value : value()),
      }),
    }),
  );
  return mergeHUDElementReferences([
    {
      labelIDs,
      quadrilateralIDs,
    },
    ...hudElementReferences,
  ]);
};
