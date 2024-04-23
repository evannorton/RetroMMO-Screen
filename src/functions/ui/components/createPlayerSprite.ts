import {
  CreateSpriteOptionsRecolor,
  Scriptable,
  createSprite,
} from "pixel-pigeon";
import { Item } from "../../../classes/Items";
import { SkinColor } from "../../../classes/SkinColor";
import { getDefinable } from "../../../definables";

export interface CreatePlayerSpriteOptions {
  condition?: () => boolean;
  clothesDyeItemID: string;
  figureID: string;
  hairDyeItemID: string;
  maskItemID: string;
  outfitItemID: string;
  skinColorID: string;
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
  const maskItem: Item = getDefinable(Item, maskItemID);
  const outfitItem: Item = getDefinable(Item, outfitItemID);
  const skinColor: SkinColor = getDefinable(SkinColor, skinColorID);
  const hairDyeItem: Item = getDefinable(Item, hairDyeItemID);
  const clothesDyeItem: Item = getDefinable(Item, clothesDyeItemID);
  const recolors: CreateSpriteOptionsRecolor[] = [
    // Clothes Primary 1
    {
      fromColor: "#0d0d0d",
      toColor: clothesDyeItem.clothesDye?.primaryClothesColor.color1 as string,
    },
    // Clothes Primary 2
    {
      fromColor: "#272727",
      toColor: clothesDyeItem.clothesDye?.primaryClothesColor.color2 as string,
    },
    // Clothes Secondary 1
    {
      fromColor: "#414141",
      toColor: clothesDyeItem.clothesDye?.secondaryClothesColor
        .color1 as string,
    },
    // Clothes Secondary 2
    {
      fromColor: "#5b5b5b",
      toColor: clothesDyeItem.clothesDye?.secondaryClothesColor
        .color2 as string,
    },
    // Hair 1
    {
      fromColor: "#757575",
      toColor: hairDyeItem.hairDye?.hairColor.color1 as string,
    },
    // Hair 2
    {
      fromColor: "#8f8f8f",
      toColor: hairDyeItem.hairDye?.hairColor.color2 as string,
    },
    // Hair 3
    {
      fromColor: "#c3c3c3",
      toColor: hairDyeItem.hairDye?.hairColor.color3 as string,
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
          const imagePath: string | undefined =
            maskItem.mask?.headCosmetic?.backImagePaths[figureID];
          return typeof imagePath !== "undefined";
        }
        return false;
      },
      x,
      y,
    },
    imagePath: (): string =>
      maskItem.mask?.headCosmetic?.backImagePaths[figureID] as string,
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
          const imagePath: string | undefined =
            outfitItem.outfit?.bodyCosmetic?.imagePaths[figureID];
          return typeof imagePath !== "undefined";
        }
        return false;
      },
      x,
      y,
    },
    imagePath: (): string =>
      outfitItem.outfit?.bodyCosmetic?.imagePaths[figureID] as string,
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
          const imagePath: string | undefined =
            maskItem.mask?.headCosmetic?.frontImagePaths[figureID];
          return typeof imagePath !== "undefined";
        }
        return false;
      },
      x,
      y,
    },
    imagePath: (): string =>
      maskItem.mask?.headCosmetic?.frontImagePaths[figureID] as string,
    recolors,
  });
};
