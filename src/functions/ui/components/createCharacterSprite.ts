import { ClothesDye } from "../../../classes/ClothesDye";
import { Constants, Direction } from "retrommo-types";
import {
  CreateSpriteOptionsAnimation,
  CreateSpriteOptionsCoordinates,
  CreateSpriteOptionsRecolor,
  Scriptable,
  addEntitySprite,
  createSprite,
} from "pixel-pigeon";
import { HairDye } from "../../../classes/HairDye";
import { Mask } from "../../../classes/Mask";
import { Outfit } from "../../../classes/Outfit";
import { SkinColor } from "../../../classes/SkinColor";
import { getConstants } from "../../getConstants";
import { getDefinable } from "definables";

export interface CreatePlayerSpriteOptions {
  clothesDyeID: Scriptable<string>;
  coordinates?: CreateSpriteOptionsCoordinates;
  direction: Scriptable<Direction>;
  entityID?: string;
  figureID: Scriptable<string>;
  hairDyeID: Scriptable<string>;
  isAnimated?: boolean;
  maskID: Scriptable<string>;
  outfitID: Scriptable<string>;
  skinColorID: Scriptable<string>;
}
export const createCharacterSprite = ({
  coordinates,
  clothesDyeID,
  direction,
  entityID,
  figureID,
  hairDyeID,
  isAnimated,
  maskID,
  outfitID,
  skinColorID,
}: CreatePlayerSpriteOptions): void => {
  if (
    (typeof entityID === "undefined") ===
    (typeof coordinates === "undefined")
  ) {
    throw new Error(
      "Either both entityID and coordinates must be defined or both must be undefined.",
    );
  }
  const constants: Constants = getConstants();
  const getClothesDye = (): ClothesDye =>
    getDefinable(
      ClothesDye,
      typeof clothesDyeID === "function" ? clothesDyeID() : clothesDyeID,
    );
  const getHairDye = (): HairDye =>
    getDefinable(
      HairDye,
      typeof hairDyeID === "function" ? hairDyeID() : hairDyeID,
    );
  const getMask = (): Mask =>
    getDefinable(Mask, typeof maskID === "function" ? maskID() : maskID);
  const getOutfit = (): Outfit =>
    getDefinable(
      Outfit,
      typeof outfitID === "function" ? outfitID() : outfitID,
    );
  const getSkinColor = (): SkinColor =>
    getDefinable(
      SkinColor,
      typeof skinColorID === "function" ? skinColorID() : skinColorID,
    );
  const recolors = (): CreateSpriteOptionsRecolor[] => {
    const clothesDye: ClothesDye = getClothesDye();
    const hairDye: HairDye = getHairDye();
    const skinColor: SkinColor = getSkinColor();
    return [
      // Clothes Primary 1
      {
        fromColor: "#0d0d0d",
        toColor: clothesDye.primaryClothesColor.color1,
      },
      // Clothes Primary 2
      {
        fromColor: "#272727",
        toColor: clothesDye.primaryClothesColor.color2,
      },
      // Clothes Secondary 1
      {
        fromColor: "#414141",
        toColor: clothesDye.secondaryClothesColor.color1,
      },
      // Clothes Secondary 2
      {
        fromColor: "#5b5b5b",
        toColor: clothesDye.secondaryClothesColor.color2,
      },
      // Hair 1
      {
        fromColor: "#757575",
        toColor: hairDye.hairColor.color1,
      },
      // Hair 2
      {
        fromColor: "#8f8f8f",
        toColor: hairDye.hairColor.color2,
      },
      // Hair 3
      {
        fromColor: "#c3c3c3",
        toColor: hairDye.hairColor.color3,
      },
      // Skin color
      {
        fromColor: "#dddddd",
        toColor: skinColor.color1,
      },
      {
        fromColor: "#f7f7f7",
        toColor: skinColor.color2,
      },
    ];
  };
  const animationID: Scriptable<string> = (): string => {
    const animationDirection: Direction =
      typeof direction === "string" ? direction : direction();
    if (isAnimated === true) {
      switch (animationDirection) {
        case Direction.Down:
          return "WalkDown";
        case Direction.Left:
          return "WalkLeft";
        case Direction.Right:
          return "WalkRight";
        case Direction.Up:
          return "WalkUp";
      }
    }
    switch (animationDirection) {
      case Direction.Down:
        return "IdleDown";
      case Direction.Left:
        return "IdleLeft";
      case Direction.Right:
        return "IdleRight";
      case Direction.Up:
        return "IdleUp";
    }
  };
  const animationStartedAt: number = 0;
  const duration: number = constants["movement-duration"];
  const tileSize: number = constants["tile-size"];
  const width: number = tileSize;
  const height: number = tileSize;
  const animations: CreateSpriteOptionsAnimation[] = [
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 0,
          sourceY: 0,
          width,
        },
      ],
      id: "IdleDown",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 0,
          sourceY: 16,
          width,
        },
      ],
      id: "IdleLeft",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 0,
          sourceY: 32,
          width,
        },
      ],
      id: "IdleRight",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 0,
          sourceY: 48,
          width,
        },
      ],
      id: "IdleUp",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 0,
          sourceY: 0,
          width,
        },
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: tileSize,
          sourceY: 0,
          width,
        },
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: tileSize * 2,
          sourceY: 0,
          width,
        },
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: tileSize * 3,
          sourceY: 0,
          width,
        },
      ],
      id: "WalkDown",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 0,
          sourceY: tileSize,
          width,
        },
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: tileSize,
          sourceY: tileSize,
          width,
        },
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: tileSize * 2,
          sourceY: tileSize,
          width,
        },
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: tileSize * 3,
          sourceY: tileSize,
          width,
        },
      ],
      id: "WalkLeft",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 0,
          sourceY: tileSize * 2,
          width,
        },
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: tileSize,
          sourceY: tileSize * 2,
          width,
        },
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: tileSize * 2,
          sourceY: tileSize * 2,
          width,
        },
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: tileSize * 3,
          sourceY: tileSize * 2,
          width,
        },
      ],
      id: "WalkRight",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 0,
          sourceY: tileSize * 3,
          width,
        },
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: tileSize,
          sourceY: tileSize * 3,
          width,
        },
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: tileSize * 2,
          sourceY: tileSize * 3,
          width,
        },
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: tileSize * 3,
          sourceY: tileSize * 3,
          width,
        },
      ],
      id: "WalkUp",
    },
  ];
  // Head back sprite
  const headBackSpriteCondition = (): boolean =>
    typeof getMask().headCosmetic.backImagePaths[
      typeof figureID === "function" ? figureID() : figureID
    ] !== "undefined";
  const headBackSpriteID: string = createSprite({
    animationID,
    animationStartedAt,
    animations,
    coordinates:
      typeof coordinates !== "undefined"
        ? {
            condition: (): boolean => {
              if (
                typeof coordinates.condition === "undefined" ||
                coordinates.condition()
              ) {
                return headBackSpriteCondition();
              }
              return false;
            },
            x: coordinates.x,
            y: coordinates.y,
          }
        : undefined,
    imagePath: (): string =>
      getMask().headCosmetic.backImagePaths[
        typeof figureID === "function" ? figureID() : figureID
      ] as string,

    recolors,
  });
  // Body sprite
  const bodySpriteCondition = (): boolean =>
    typeof getOutfit().bodyCosmetic.imagePaths[
      typeof figureID === "function" ? figureID() : figureID
    ] !== "undefined";
  const bodySpriteID: string = createSprite({
    animationID,
    animationStartedAt,
    animations,
    coordinates:
      typeof coordinates !== "undefined"
        ? {
            condition: (): boolean => {
              if (
                typeof coordinates.condition === "undefined" ||
                coordinates.condition()
              ) {
                return bodySpriteCondition();
              }
              return false;
            },
            x: coordinates.x,
            y: coordinates.y,
          }
        : undefined,
    imagePath: (): string =>
      getOutfit().bodyCosmetic.imagePaths[
        typeof figureID === "function" ? figureID() : figureID
      ] as string,
    recolors,
  });
  // Head front sprite
  const headFrontSpriteCondition = (): boolean =>
    typeof getMask().headCosmetic.frontImagePaths[
      typeof figureID === "function" ? figureID() : figureID
    ] !== "undefined";
  const headFrontSpriteID: string = createSprite({
    animationID,
    animationStartedAt,
    animations,
    coordinates:
      typeof coordinates !== "undefined"
        ? {
            condition: (): boolean => {
              if (
                typeof coordinates.condition === "undefined" ||
                coordinates.condition()
              ) {
                return headFrontSpriteCondition();
              }
              return false;
            },
            x: coordinates.x,
            y: coordinates.y,
          }
        : undefined,
    imagePath: (): string =>
      getMask().headCosmetic.frontImagePaths[
        typeof figureID === "function" ? figureID() : figureID
      ] as string,
    recolors,
  });
  if (typeof entityID !== "undefined") {
    addEntitySprite(entityID, {
      condition: headBackSpriteCondition,
      spriteID: headBackSpriteID,
    });
    addEntitySprite(entityID, {
      condition: bodySpriteCondition,
      spriteID: bodySpriteID,
    });
    addEntitySprite(entityID, {
      condition: headFrontSpriteCondition,
      spriteID: headFrontSpriteID,
    });
  }
};
