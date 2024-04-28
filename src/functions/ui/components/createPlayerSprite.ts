import { BodyCosmetic } from "../../../classes/BodyCosmetic";
import { ClothesDye } from "../../../classes/ClothesDye";
import {
  CreateSpriteOptionsRecolor,
  Scriptable,
  createSprite,
} from "pixel-pigeon";
import { HairDye } from "../../../classes/HairDye";
import { HeadCosmetic } from "../../../classes/HeadCosmetic";
import { Item } from "../../../classes/Item";
import { Mask } from "../../../classes/Mask";
import { SkinColor } from "../../../classes/SkinColor";
import { getDefinable } from "../../../definables";

export interface CreatePlayerSpriteOptions {
  condition?: () => boolean;
  clothesDyeItemID: Scriptable<string>;
  figureID: Scriptable<string>;
  hairDyeItemID: Scriptable<string>;
  maskItemID: Scriptable<string>;
  outfitItemID: Scriptable<string>;
  skinColorID: Scriptable<string>;
  x: Scriptable<number>;
  y: Scriptable<number>;
}
export const createPlayerSprite = ({
  condition,
  clothesDyeItemID,
  figureID,
  hairDyeItemID,
  maskItemID,
  outfitItemID,
  skinColorID,
  x,
  y,
}: CreatePlayerSpriteOptions): void => {
  const getMaskItem = (): Item =>
    getDefinable(
      Item,
      typeof maskItemID === "function" ? maskItemID() : maskItemID,
    );
  const getMask = (): Mask => {
    const maskItem: Item = getMaskItem();
    if (typeof maskItem.mask === "undefined") {
      throw new Error("Mask is undefined");
    }
    return maskItem.mask;
  };
  const getHeadCosmetic = (): HeadCosmetic => {
    const mask: Mask = getMask();
    if (typeof mask.headCosmetic === "undefined") {
      throw new Error("Head cosmetic is undefined");
    }
    return mask.headCosmetic;
  };
  const getOutfitItem = (): Item =>
    getDefinable(
      Item,
      typeof outfitItemID === "function" ? outfitItemID() : outfitItemID,
    );
  const getOutfit = (): Item => {
    const outfitItem: Item = getOutfitItem();
    if (typeof outfitItem.outfit === "undefined") {
      throw new Error("Outfit is undefined");
    }
    return outfitItem;
  };
  const getBodyCosmetic = (): BodyCosmetic => {
    const outfitItem: Item = getOutfit();
    if (typeof outfitItem.outfit?.bodyCosmetic === "undefined") {
      throw new Error("Body cosmetic is undefined");
    }
    return outfitItem.outfit.bodyCosmetic;
  };
  const getSkinColor = (): SkinColor =>
    getDefinable(
      SkinColor,
      typeof skinColorID === "function" ? skinColorID() : skinColorID,
    );
  const getHairDyeItem = (): Item =>
    getDefinable(
      Item,
      typeof hairDyeItemID === "function" ? hairDyeItemID() : hairDyeItemID,
    );
  const getHairDye = (): HairDye => {
    const hairDyeItem: Item = getHairDyeItem();
    if (typeof hairDyeItem.hairDye === "undefined") {
      throw new Error("Hair dye is undefined");
    }
    return hairDyeItem.hairDye;
  };
  const getClothesDyeItem = (): Item =>
    getDefinable(
      Item,
      typeof clothesDyeItemID === "function"
        ? clothesDyeItemID()
        : clothesDyeItemID,
    );
  const getClothesDye = (): ClothesDye => {
    const clothesDyeItem: Item = getClothesDyeItem();
    if (typeof clothesDyeItem.clothesDye === "undefined") {
      throw new Error("Clothes dye is undefined");
    }
    return clothesDyeItem.clothesDye;
  };
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
            typeof getHeadCosmetic().backImagePaths[
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
      getHeadCosmetic().backImagePaths[
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
            typeof getBodyCosmetic().imagePaths[
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
      getBodyCosmetic().imagePaths[
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
            typeof getHeadCosmetic().frontImagePaths[
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
      getHeadCosmetic().frontImagePaths[
        typeof figureID === "function" ? figureID() : figureID
      ] as string,
    recolors,
  });
};
