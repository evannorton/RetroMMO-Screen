import { Class } from "../../classes/Class";
import {
  createButton,
  createLabel,
  createNineSlice,
  createSprite,
  emitToSocketioServer,
  getGameHeight,
  getGameWidth,
} from "pixel-pigeon";
import { getDefinables } from "../../definables";

export const createCharacterCreateUI = (): void => {
  const condition = (): boolean => true;
  // Background panel
  createNineSlice({
    bottomHeight: 16,
    coordinates: {
      condition,
      x: 0,
      y: 0,
    },
    height: getGameHeight(),
    imagePath: "panels/basic",
    leftWidth: 16,
    rightWidth: 16,
    topHeight: 16,
    width: getGameWidth(),
  });
  // Back arrow sprite
  // createSprite({
  //   animationID: "default",
  //   animations: [
  //     {
  //       frames: [
  //         {
  //           height: 14,
  //           sourceHeight: 14,
  //           sourceWidth: 14,
  //           sourceX: 0,
  //           sourceY: 0,
  //           width: 14,
  //         },
  //       ],
  //       id: "default",
  //     },
  //   ],
  //   coordinates: {
  //     condition,
  //     x: 16,
  //     y: 16,
  //   },
  //   imagePath: "arrows/left",
  //   recolors: [],
  // });
  // Back arrow button
  createButton({
    coordinates: {
      condition,
      x: 16,
      y: 16,
    },
    height: 14,
    onClick: (): void => {
      emitToSocketioServer({
        event: "legacy-character-create-back",
      });
    },
    width: 14,
  });
  // Title text
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: 152,
      y: 10,
    },
    horizontalAlignment: "center",
    size: 2,
    text: { value: "Character Creation" },
  });
  const classes: [string, Class][] = Array.from(getDefinables(Class));
  const sortedClasses: [string, Class][] = classes.sort(
    ([, a]: [string, Class], [, b]: [string, Class]): number =>
      a.order - b.order,
  );
  sortedClasses.forEach(
    ([, sortedClass]: [string, Class], sortedClassIndex: number): void => {
      // Class panel
      createNineSlice({
        bottomHeight: 16,
        coordinates: {
          condition,
          x: 16 + sortedClassIndex * 96,
          y: 48,
        },
        height: 80,
        imagePath: "panels/basic",
        leftWidth: 16,
        rightWidth: 16,
        topHeight: 16,
        width: 80,
      });
      // Class name text
      createLabel({
        color: "#ffffff",
        coordinates: {
          condition,
          x: 56 + sortedClassIndex * 96,
          y: 57,
        },
        horizontalAlignment: "center",
        size: 1,
        text: { value: sortedClass.name },
      });
      // Class sprite
      createSprite({
        animationID: "default",
        animations: [
          {
            frames: [
              {
                height: 16,
                sourceHeight: 16,
                sourceWidth: 16,
                sourceX: 0,
                sourceY: 0,
                width: 16,
              },
            ],
            id: "default",
          },
        ],
        coordinates: {
          condition: (): boolean => {
            if (condition()) {
              const imagePath: string | undefined =
                sortedClass.defaultMaskItem.mask?.headCosmetic?.backImagePaths[
                  sortedClass.defaultFigure.id
                ];
              return typeof imagePath !== "undefined";
            }
            return false;
          },
          x: 48 + sortedClassIndex * 96,
          y: 74,
        },
        imagePath: (): string =>
          sortedClass.defaultMaskItem.mask?.headCosmetic?.backImagePaths[
            sortedClass.defaultFigure.id
          ] as string,
      });
      createSprite({
        animationID: "default",
        animations: [
          {
            frames: [
              {
                height: 16,
                sourceHeight: 16,
                sourceWidth: 16,
                sourceX: 0,
                sourceY: 0,
                width: 16,
              },
            ],
            id: "default",
          },
        ],
        coordinates: {
          condition: (): boolean => {
            if (condition()) {
              const imagePath: string | undefined =
                sortedClass.defaultOutfitItem.outfit?.bodyCosmetic?.imagePaths[
                  sortedClass.defaultFigure.id
                ];
              return typeof imagePath !== "undefined";
            }
            return false;
          },
          x: 48 + sortedClassIndex * 96,
          y: 74,
        },
        imagePath: (): string =>
          sortedClass.defaultOutfitItem.outfit?.bodyCosmetic?.imagePaths[
            sortedClass.defaultFigure.id
          ] as string,
      });
      createSprite({
        animationID: "default",
        animations: [
          {
            frames: [
              {
                height: 16,
                sourceHeight: 16,
                sourceWidth: 16,
                sourceX: 0,
                sourceY: 0,
                width: 16,
              },
            ],
            id: "default",
          },
        ],
        coordinates: {
          condition: (): boolean => {
            if (condition()) {
              const imagePath: string | undefined =
                sortedClass.defaultMaskItem.mask?.headCosmetic?.frontImagePaths[
                  sortedClass.defaultFigure.id
                ];
              return typeof imagePath !== "undefined";
            }
            return false;
          },
          x: 48 + sortedClassIndex * 96,
          y: 74,
        },
        imagePath: (): string =>
          sortedClass.defaultMaskItem.mask?.headCosmetic?.frontImagePaths[
            sortedClass.defaultFigure.id
          ] as string,
      });
    },
  );
};
