import { Color, Constants } from "retrommo-types";
import { EntityQuadrilateral, createQuadrilateral } from "pixel-pigeon";
import { getConstants } from "./getConstants";

export const getMarkerQuadrilaterals = (
  color: Color,
): EntityQuadrilateral[] => {
  const constants: Constants = getConstants();
  const entityQuadrilaterals: EntityQuadrilateral[] = [];
  entityQuadrilaterals.push({
    quadrilateralID: createQuadrilateral({
      color: Color.Black,
      height: 1,
      width: constants["tile-size"] + 8,
    }),
    x: -4,
    y: -4,
  });
  entityQuadrilaterals.push({
    quadrilateralID: createQuadrilateral({
      color: Color.Black,
      height: constants["tile-size"] + 6,
      width: 1,
    }),
    x: 19,
    y: -3,
  });
  entityQuadrilaterals.push({
    quadrilateralID: createQuadrilateral({
      color: Color.Black,
      height: 1,
      width: constants["tile-size"] + 8,
    }),
    x: -4,
    y: 19,
  });
  entityQuadrilaterals.push({
    quadrilateralID: createQuadrilateral({
      color: Color.Black,
      height: constants["tile-size"] + 6,
      width: 1,
    }),
    x: -4,
    y: -3,
  });
  entityQuadrilaterals.push({
    quadrilateralID: createQuadrilateral({
      color: Color.Black,
      height: 1,
      width: constants["tile-size"] + 4,
    }),
    x: -2,
    y: -2,
  });
  entityQuadrilaterals.push({
    quadrilateralID: createQuadrilateral({
      color: Color.Black,
      height: constants["tile-size"] + 2,
      width: 1,
    }),
    x: 17,
    y: -1,
  });
  entityQuadrilaterals.push({
    quadrilateralID: createQuadrilateral({
      color: Color.Black,
      height: 1,
      width: constants["tile-size"] + 4,
    }),
    x: -2,
    y: 17,
  });
  entityQuadrilaterals.push({
    quadrilateralID: createQuadrilateral({
      color: Color.Black,
      height: constants["tile-size"] + 2,
      width: 1,
    }),
    x: -2,
    y: -1,
  });
  entityQuadrilaterals.push({
    quadrilateralID: createQuadrilateral({
      color,
      height: 1,
      width: constants["tile-size"] + 6,
    }),
    x: -3,
    y: -3,
  });
  entityQuadrilaterals.push({
    quadrilateralID: createQuadrilateral({
      color,
      height: constants["tile-size"] + 4,
      width: 1,
    }),
    x: 18,
    y: -2,
  });
  entityQuadrilaterals.push({
    quadrilateralID: createQuadrilateral({
      color,
      height: 1,
      width: constants["tile-size"] + 6,
    }),
    x: -3,
    y: 18,
  });
  entityQuadrilaterals.push({
    quadrilateralID: createQuadrilateral({
      color,
      height: constants["tile-size"] + 4,
      width: 1,
    }),
    x: -3,
    y: -2,
  });
  return entityQuadrilaterals;
};
