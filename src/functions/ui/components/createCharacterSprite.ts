import { ClothesDye } from "../../../classes/ClothesDye";
import { Constants, Direction, Step } from "retrommo-types";
import {
  CreateSpriteOptionsAnimation,
  CreateSpriteOptionsRecolor,
  Scriptable,
  addEntitySprite,
  createSprite,
  getCurrentTime,
} from "pixel-pigeon";
import { HairDye } from "../../../classes/HairDye";
import { Mask } from "../../../classes/Mask";
import { Outfit } from "../../../classes/Outfit";
import { SkinColor } from "../../../classes/SkinColor";
import { getConstants } from "../../getConstants";
import { getDefinable } from "definables";

export interface CreatePlayerSpriteOptionsCoordinates {
  condition?: () => boolean;
  isAnimated?: boolean;
  x: Scriptable<number>;
  y: Scriptable<number>;
}
export interface CreatePlayerSpriteOptionsEntity {
  animationStartedAt: Scriptable<number | null>;
  entityID: string;
  step: Scriptable<Step>;
}
export interface CreatePlayerSpriteOptions {
  clothesDyeID: Scriptable<string>;
  coordinates?: CreatePlayerSpriteOptionsCoordinates;
  direction: Scriptable<Direction>;
  entity?: CreatePlayerSpriteOptionsEntity;
  figureID: Scriptable<string>;
  hairDyeID: Scriptable<string>;
  maskID: Scriptable<string>;
  outfitID: Scriptable<string>;
  skinColorID: Scriptable<string>;
}
export const createCharacterSprite = ({
  coordinates,
  clothesDyeID,
  direction,
  entity,
  figureID,
  hairDyeID,
  maskID,
  outfitID,
  skinColorID,
}: CreatePlayerSpriteOptions): void => {
  if (
    (typeof entity === "undefined") ===
    (typeof coordinates === "undefined")
  ) {
    throw new Error(
      "Either both entity and coordinates must be defined or both must be undefined.",
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
    if (typeof coordinates !== "undefined") {
      if (coordinates.isAnimated === true) {
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
      } else {
        switch (animationDirection) {
          case Direction.Down:
            return "IdleDownRight";
          case Direction.Left:
            return "IdleLeftRight";
          case Direction.Right:
            return "IdleRightRight";
          case Direction.Up:
            return "IdleUpRight";
        }
      }
    }
    if (typeof entity === "undefined") {
      throw new Error("Entity is undefined.");
    }
    const step: Step =
      typeof entity.step === "string" ? entity.step : entity.step();
    if (entity.animationStartedAt !== null) {
      const animationStartedAt: number | null =
        typeof entity.animationStartedAt === "number"
          ? entity.animationStartedAt
          : entity.animationStartedAt();
      if (animationStartedAt !== null) {
        const sinceAnimationStarted: number =
          getCurrentTime() - animationStartedAt;
        if (sinceAnimationStarted < constants["movement-duration"] / 2) {
          switch (animationDirection) {
            case Direction.Down:
              switch (step) {
                case Step.Left:
                  return "StepDownLeft";
                case Step.Right:
                  return "StepDownRight";
              }
              throw new Error("Invalid step.");
            case Direction.Left:
              switch (step) {
                case Step.Left:
                  return "StepLeftLeft";
                case Step.Right:
                  return "StepLeftRight";
              }
              throw new Error("Invalid step.");
            case Direction.Right:
              switch (step) {
                case Step.Left:
                  return "StepRightLeft";
                case Step.Right:
                  return "StepRightRight";
              }
              throw new Error("Invalid step.");
            case Direction.Up:
              switch (step) {
                case Step.Left:
                  return "StepUpLeft";
                case Step.Right:
                  return "StepUpRight";
              }
              throw new Error("Invalid step.");
          }
        }
      }
    }
    switch (animationDirection) {
      case Direction.Down:
        switch (step) {
          case Step.Left:
            return "IdleDownLeft";
          case Step.Right:
            return "IdleDownRight";
        }
        throw new Error("Invalid step.");
      case Direction.Left:
        switch (step) {
          case Step.Left:
            return "IdleLeftLeft";
          case Step.Right:
            return "IdleLeftRight";
        }
        throw new Error("Invalid step.");
      case Direction.Right:
        switch (step) {
          case Step.Left:
            return "IdleRightLeft";
          case Step.Right:
            return "IdleRightRight";
        }
        throw new Error("Invalid step.");
      case Direction.Up:
        switch (step) {
          case Step.Left:
            return "IdleUpLeft";
          case Step.Right:
            return "IdleUpRight";
        }
        throw new Error("Invalid step.");
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
          sourceX: 32,
          sourceY: 0,
          width,
        },
      ],
      id: "IdleDownLeft",
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
      ],
      id: "IdleDownRight",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 32,
          sourceY: 16,
          width,
        },
      ],
      id: "IdleLeftLeft",
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
      id: "IdleLeftRight",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 32,
          sourceY: 32,
          width,
        },
      ],
      id: "IdleRightLeft",
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
      id: "IdleRightRight",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 32,
          sourceY: 48,
          width,
        },
      ],
      id: "IdleUpLeft",
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
      id: "IdleUpRight",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 48,
          sourceY: 0,
          width,
        },
      ],
      id: "StepDownLeft",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 16,
          sourceY: 0,
          width,
        },
      ],
      id: "StepDownRight",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 48,
          sourceY: 16,
          width,
        },
      ],
      id: "StepLeftLeft",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 16,
          sourceY: 16,
          width,
        },
      ],
      id: "StepLeftRight",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 48,
          sourceY: 32,
          width,
        },
      ],
      id: "StepRightLeft",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 16,
          sourceY: 32,
          width,
        },
      ],
      id: "StepRightRight",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 48,
          sourceY: 48,
          width,
        },
      ],
      id: "StepUpLeft",
    },
    {
      frames: [
        {
          duration,
          height,
          sourceHeight: height,
          sourceWidth: width,
          sourceX: 16,
          sourceY: 48,
          width,
        },
      ],
      id: "StepUpRight",
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
  if (typeof entity !== "undefined") {
    addEntitySprite(entity.entityID, {
      condition: headBackSpriteCondition,
      spriteID: headBackSpriteID,
    });
    addEntitySprite(entity.entityID, {
      condition: bodySpriteCondition,
      spriteID: bodySpriteID,
    });
    addEntitySprite(entity.entityID, {
      condition: headFrontSpriteCondition,
      spriteID: headFrontSpriteID,
    });
  }
};
