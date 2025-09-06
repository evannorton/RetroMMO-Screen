import { ClothesDye } from "../../../classes/ClothesDye";
import { Constants, Direction, Step } from "retrommo-types";
import {
  CreateSpriteOptionsAnimation,
  CreateSpriteOptionsRecolor,
  HUDElementReferences,
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
  readonly condition?: () => boolean;
  readonly isAnimated?: boolean;
  readonly x: Scriptable<number>;
  readonly y: Scriptable<number>;
}
export interface CreatePlayerSpriteOptionsEntity {
  readonly animationStartedAt: Scriptable<number | null>;
  readonly entityID: string;
  readonly step: Scriptable<Step>;
}
export interface CreatePlayerSpriteOptions {
  readonly clothesDyeID: Scriptable<string>;
  readonly coordinates?: CreatePlayerSpriteOptionsCoordinates;
  readonly direction: Scriptable<Direction>;
  readonly entity?: CreatePlayerSpriteOptionsEntity;
  readonly figureID: Scriptable<string>;
  readonly hairDyeID: Scriptable<string>;
  readonly maskID: Scriptable<string>;
  readonly outfitID: Scriptable<string>;
  readonly scale?: number;
  readonly skinColorID: Scriptable<string>;
  readonly statusIconImagePaths?: Scriptable<readonly string[]>;
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
  scale = 1,
  skinColorID,
  statusIconImagePaths,
}: CreatePlayerSpriteOptions): HUDElementReferences => {
  if (
    (typeof entity === "undefined") ===
    (typeof coordinates === "undefined")
  ) {
    throw new Error(
      "Either both entity and coordinates must be defined or both must be undefined.",
    );
  }
  const spriteIDs: string[] = [];
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
  const size: number = tileSize;
  const scaledSize: number = size * scale;
  const animations: CreateSpriteOptionsAnimation[] = [
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 32,
          sourceY: 0,
          width: scaledSize,
        },
      ],
      id: "IdleDownLeft",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 0,
          sourceY: 0,
          width: scaledSize,
        },
      ],
      id: "IdleDownRight",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 32,
          sourceY: 16,
          width: scaledSize,
        },
      ],
      id: "IdleLeftLeft",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 0,
          sourceY: 16,
          width: scaledSize,
        },
      ],
      id: "IdleLeftRight",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 32,
          sourceY: 32,
          width: scaledSize,
        },
      ],
      id: "IdleRightLeft",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 0,
          sourceY: 32,
          width: scaledSize,
        },
      ],
      id: "IdleRightRight",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 32,
          sourceY: 48,
          width: scaledSize,
        },
      ],
      id: "IdleUpLeft",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 0,
          sourceY: 48,
          width: scaledSize,
        },
      ],
      id: "IdleUpRight",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 48,
          sourceY: 0,
          width: scaledSize,
        },
      ],
      id: "StepDownLeft",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 16,
          sourceY: 0,
          width: scaledSize,
        },
      ],
      id: "StepDownRight",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 48,
          sourceY: 16,
          width: scaledSize,
        },
      ],
      id: "StepLeftLeft",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 16,
          sourceY: 16,
          width: scaledSize,
        },
      ],
      id: "StepLeftRight",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 48,
          sourceY: 32,
          width: scaledSize,
        },
      ],
      id: "StepRightLeft",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 16,
          sourceY: 32,
          width: scaledSize,
        },
      ],
      id: "StepRightRight",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 48,
          sourceY: 48,
          width: scaledSize,
        },
      ],
      id: "StepUpLeft",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 16,
          sourceY: 48,
          width: scaledSize,
        },
      ],
      id: "StepUpRight",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 0,
          sourceY: 0,
          width: scaledSize,
        },
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: tileSize,
          sourceY: 0,
          width: scaledSize,
        },
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: tileSize * 2,
          sourceY: 0,
          width: scaledSize,
        },
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: tileSize * 3,
          sourceY: 0,
          width: scaledSize,
        },
      ],
      id: "WalkDown",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 0,
          sourceY: tileSize,
          width: scaledSize,
        },
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: tileSize,
          sourceY: tileSize,
          width: scaledSize,
        },
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: tileSize * 2,
          sourceY: tileSize,
          width: scaledSize,
        },
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: tileSize * 3,
          sourceY: tileSize,
          width: scaledSize,
        },
      ],
      id: "WalkLeft",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 0,
          sourceY: tileSize * 2,
          width: scaledSize,
        },
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: tileSize,
          sourceY: tileSize * 2,
          width: scaledSize,
        },
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: tileSize * 2,
          sourceY: tileSize * 2,
          width: scaledSize,
        },
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: tileSize * 3,
          sourceY: tileSize * 2,
          width: scaledSize,
        },
      ],
      id: "WalkRight",
    },
    {
      frames: [
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: 0,
          sourceY: tileSize * 3,
          width: scaledSize,
        },
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: tileSize,
          sourceY: tileSize * 3,
          width: scaledSize,
        },
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: tileSize * 2,
          sourceY: tileSize * 3,
          width: scaledSize,
        },
        {
          duration,
          height: scaledSize,
          sourceHeight: size,
          sourceWidth: size,
          sourceX: tileSize * 3,
          sourceY: tileSize * 3,
          width: scaledSize,
        },
      ],
      id: "WalkUp",
    },
  ];
  const getStatusIconImagePath = (index: number): string => {
    const paths: readonly string[] =
      typeof statusIconImagePaths === "function"
        ? statusIconImagePaths()
        : statusIconImagePaths ?? [];
    if (typeof paths[index] === "undefined") {
      throw new Error(`paths[${index}] is undefined`);
    }
    return paths[index];
  };
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
  spriteIDs.push(headBackSpriteID);
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
  spriteIDs.push(bodySpriteID);
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
  spriteIDs.push(headFrontSpriteID);
  // Status icon sprites
  const statusIconPosition1SpriteID: string = createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: 9,
            sourceHeight: 9,
            sourceWidth: 9,
            sourceX: 0,
            sourceY: 0,
            width: 9,
          },
        ],
        id: "default",
      },
    ],
    coordinates:
      typeof coordinates !== "undefined"
        ? {
            condition: (): boolean => {
              if (
                typeof coordinates.condition === "undefined" ||
                coordinates.condition()
              ) {
                return (
                  (typeof statusIconImagePaths === "function"
                    ? statusIconImagePaths()
                    : statusIconImagePaths ?? []
                  ).length === 1
                );
              }
              return false;
            },
            x: (): number =>
              (typeof coordinates.x === "function"
                ? coordinates.x()
                : coordinates.x) + 3,
            y: (): number =>
              (typeof coordinates.y === "function"
                ? coordinates.y()
                : coordinates.y) + 11,
          }
        : undefined,
    imagePath: (): string => getStatusIconImagePath(0),
  });
  spriteIDs.push(statusIconPosition1SpriteID);
  const statusIconPosition2SpriteID: string = createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: 9,
            sourceHeight: 9,
            sourceWidth: 9,
            sourceX: 0,
            sourceY: 0,
            width: 9,
          },
        ],
        id: "default",
      },
    ],
    coordinates:
      typeof coordinates !== "undefined"
        ? {
            condition: (): boolean => {
              if (
                typeof coordinates.condition === "undefined" ||
                coordinates.condition()
              ) {
                return (
                  (typeof statusIconImagePaths === "function"
                    ? statusIconImagePaths()
                    : statusIconImagePaths ?? []
                  ).length === 2
                );
              }
              return false;
            },
            x: (): number =>
              (typeof coordinates.x === "function"
                ? coordinates.x()
                : coordinates.x) - 2,
            y: (): number =>
              (typeof coordinates.y === "function"
                ? coordinates.y()
                : coordinates.y) + 11,
          }
        : undefined,
    imagePath: (): string => getStatusIconImagePath(0),
  });
  spriteIDs.push(statusIconPosition2SpriteID);
  const statusIconPosition3SpriteID: string = createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: 9,
            sourceHeight: 9,
            sourceWidth: 9,
            sourceX: 0,
            sourceY: 0,
            width: 9,
          },
        ],
        id: "default",
      },
    ],
    coordinates:
      typeof coordinates !== "undefined"
        ? {
            condition: (): boolean => {
              if (
                typeof coordinates.condition === "undefined" ||
                coordinates.condition()
              ) {
                return (
                  (typeof statusIconImagePaths === "function"
                    ? statusIconImagePaths()
                    : statusIconImagePaths ?? []
                  ).length === 2
                );
              }
              return false;
            },
            x: (): number =>
              (typeof coordinates.x === "function"
                ? coordinates.x()
                : coordinates.x) + 8,
            y: (): number =>
              (typeof coordinates.y === "function"
                ? coordinates.y()
                : coordinates.y) + 11,
          }
        : undefined,
    imagePath: (): string => getStatusIconImagePath(1),
  });
  spriteIDs.push(statusIconPosition3SpriteID);
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
  return { spriteIDs };
};
