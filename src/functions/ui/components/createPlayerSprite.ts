import { ClothesDye } from "../../../classes/ClothesDye";
import {
  CreateSpriteOptionsRecolor,
  Scriptable,
  createSprite,
} from "pixel-pigeon";
import { HairDye } from "../../../classes/HairDye";
import { Mask } from "../../../classes/Mask";
import { Outfit } from "../../../classes/Outfit";
import { SkinColor } from "../../../classes/SkinColor";
import { getDefinable } from "../../../definables";

export interface CreatePlayerSpriteOptions {
  condition?: () => boolean;
  clothesDyeID: Scriptable<string>;
  figureID: Scriptable<string>;
  hairDyeID: Scriptable<string>;
  maskID: Scriptable<string>;
  outfitID: Scriptable<string>;
  skinColorID: Scriptable<string>;
  x: Scriptable<number>;
  y: Scriptable<number>;
}
export const createPlayerSprite = ({
  condition,
  clothesDyeID,
  figureID,
  hairDyeID,
  maskID,
  outfitID,
  skinColorID,
  x,
  y,
}: CreatePlayerSpriteOptions): void => {
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
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            duration: 250,
            height: 16,
            sourceHeight: 16,
            sourceWidth: 16,
            sourceX: 0,
            sourceY: 0,
            width: 16,
          },
          {
            duration: 250,
            height: 16,
            sourceHeight: 16,
            sourceWidth: 16,
            sourceX: 16,
            sourceY: 0,
            width: 16,
          },
          {
            duration: 250,
            height: 16,
            sourceHeight: 16,
            sourceWidth: 16,
            sourceX: 32,
            sourceY: 0,
            width: 16,
          },
          {
            duration: 250,
            height: 16,
            sourceHeight: 16,
            sourceWidth: 16,
            sourceX: 48,
            sourceY: 0,
            width: 16,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition: (): boolean => {
        if (typeof condition === "undefined" || condition()) {
          return (
            typeof getMask().headCosmetic.backImagePaths[
              typeof figureID === "function" ? figureID() : figureID
            ] !== "undefined"
          );
        }
        return false;
      },
      x,
      y,
    },
    imagePath: (): string =>
      getMask().headCosmetic.backImagePaths[
        typeof figureID === "function" ? figureID() : figureID
      ] as string,

    recolors,
  });
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            duration: 250,
            height: 16,
            sourceHeight: 16,
            sourceWidth: 16,
            sourceX: 0,
            sourceY: 0,
            width: 16,
          },
          {
            duration: 250,
            height: 16,
            sourceHeight: 16,
            sourceWidth: 16,
            sourceX: 16,
            sourceY: 0,
            width: 16,
          },
          {
            duration: 250,
            height: 16,
            sourceHeight: 16,
            sourceWidth: 16,
            sourceX: 32,
            sourceY: 0,
            width: 16,
          },
          {
            duration: 250,
            height: 16,
            sourceHeight: 16,
            sourceWidth: 16,
            sourceX: 48,
            sourceY: 0,
            width: 16,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition: (): boolean => {
        if (typeof condition === "undefined" || condition()) {
          return (
            typeof getOutfit().bodyCosmetic.imagePaths[
              typeof figureID === "function" ? figureID() : figureID
            ] !== "undefined"
          );
        }
        return false;
      },
      x,
      y,
    },
    imagePath: (): string =>
      getOutfit().bodyCosmetic.imagePaths[
        typeof figureID === "function" ? figureID() : figureID
      ],
    recolors,
  });
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            duration: 250,
            height: 16,
            sourceHeight: 16,
            sourceWidth: 16,
            sourceX: 0,
            sourceY: 0,
            width: 16,
          },
          {
            duration: 250,
            height: 16,
            sourceHeight: 16,
            sourceWidth: 16,
            sourceX: 16,
            sourceY: 0,
            width: 16,
          },
          {
            duration: 250,
            height: 16,
            sourceHeight: 16,
            sourceWidth: 16,
            sourceX: 32,
            sourceY: 0,
            width: 16,
          },
          {
            duration: 250,
            height: 16,
            sourceHeight: 16,
            sourceWidth: 16,
            sourceX: 48,
            sourceY: 0,
            width: 16,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition: (): boolean => {
        if (typeof condition === "undefined" || condition()) {
          return (
            typeof getMask().headCosmetic.frontImagePaths[
              typeof figureID === "function" ? figureID() : figureID
            ] !== "undefined"
          );
        }
        return false;
      },
      x,
      y,
    },
    imagePath: (): string =>
      getMask().headCosmetic.frontImagePaths[
        typeof figureID === "function" ? figureID() : figureID
      ] as string,
    recolors,
  });
};
