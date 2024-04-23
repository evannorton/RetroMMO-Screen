import { Item } from "../../../classes/Items";
import { Scriptable, createSprite } from "pixel-pigeon";
import { getDefinable } from "../../../definables";

export interface CreatePlayerSpriteOptions {
  condition?: () => boolean;
  figureID: string;
  maskItemID: string;
  outfitItemID: string;
  x: Scriptable<number>;
  y: Scriptable<number>;
}
export const createPlayerSprite = ({
  condition,
  figureID,
  maskItemID,
  outfitItemID,
  x,
  y,
}: CreatePlayerSpriteOptions): void => {
  const maskItem: Item = getDefinable(Item, maskItemID);
  const outfitItem: Item = getDefinable(Item, outfitItemID);
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
  });
};
