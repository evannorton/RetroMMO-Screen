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
  figureID: string;
  maskItemID: string;
  outfitItemID: string;
  skinColorID: string;
  x: Scriptable<number>;
  y: Scriptable<number>;
}
export const createPlayerSprite = ({
  condition,
  figureID,
  maskItemID,
  outfitItemID,
  skinColorID,
  x,
  y,
}: CreatePlayerSpriteOptions): void => {
  const skinColor: SkinColor = getDefinable(SkinColor, skinColorID);
  const maskItem: Item = getDefinable(Item, maskItemID);
  const outfitItem: Item = getDefinable(Item, outfitItemID);
  const recolors: CreateSpriteOptionsRecolor[] = [
    // // Clothes Primary 1
    // {
    //   toColor: primaryClothesColor.color1,
    //   fromColor: "#0d0d0d",
    // },
    // // Clothes Primary 2
    // {
    //   toColor: primaryClothesColor.color2,
    //   fromColor: "#272727",
    // },
    // // Clothes Secondary 1
    // {
    //   toColor: secondaryClothesColor.color1,
    //   fromColor: "#414141",
    // },
    // // Clothes Secondary 2
    // {
    //   toColor: secondaryClothesColor.color2,
    //   fromColor: "#5b5b5b",
    // },
    // // Hair 1
    // {
    //   toColor: hairColor.color1,
    //   fromColor: "#757575",
    // },
    // // Hair 2
    // {
    //   toColor: hairColor.color2,
    //   fromColor: "#8f8f8f",
    // },
    // // Hair 3
    // {
    //   toColor: hairColor.color3,
    //   fromColor: "#c3c3c3",
    // },
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
