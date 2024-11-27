import { Color } from "retrommo-types";
import { HUDElementReferences, createQuadrilateral } from "pixel-pigeon";

interface CreateUnderstrikeOptions {
  condition?: () => boolean;
  width: number;
  x: number;
  y: number;
}

export const createUnderstrike = ({
  condition,
  width,
  x,
  y,
}: CreateUnderstrikeOptions): HUDElementReferences => {
  const quadrilateralIDs: string[] = [];
  quadrilateralIDs.push(
    createQuadrilateral({
      color: Color.DarkGray,
      coordinates: {
        condition,
        x,
        y,
      },
      height: 1,
      width: 1,
    }),
  );
  quadrilateralIDs.push(
    createQuadrilateral({
      color: Color.DarkGray,
      coordinates: {
        condition,
        x: x + 2,
        y,
      },
      height: 1,
      width: 2,
    }),
  );
  quadrilateralIDs.push(
    createQuadrilateral({
      color: Color.DarkGray,
      coordinates: {
        condition,
        x: x + 5,
        y,
      },
      height: 1,
      width: width - 10,
    }),
  );
  quadrilateralIDs.push(
    createQuadrilateral({
      color: Color.DarkGray,
      coordinates: {
        condition,
        x: x + width - 4,
        y,
      },
      height: 1,
      width: 2,
    }),
  );
  quadrilateralIDs.push(
    createQuadrilateral({
      color: Color.DarkGray,
      coordinates: {
        condition,
        x: x + width - 1,
        y,
      },
      height: 1,
      width: 1,
    }),
  );
  return {
    quadrilateralIDs,
  };
};
